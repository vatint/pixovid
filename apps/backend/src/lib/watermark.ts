import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { prisma } from "@repo/db";

const FONT_CANDIDATES = [
  "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
  "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
  "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf",
];

let resolvedFont: string | null | undefined;

async function fontFile(): Promise<string | null> {
  if (resolvedFont !== undefined) return resolvedFont;
  for (const p of FONT_CANDIDATES) {
    try {
      await access(p);
      resolvedFont = p;
      return p;
    } catch {
      /* try next */
    }
  }
  resolvedFont = null;
  return null;
}

function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...args], {
      stdio: ["ignore", "ignore", "pipe"],
    });
    let stderr = "";
    proc.stderr.on("data", (d) => {
      stderr += d.toString();
    });
    proc.on("error", (err) => {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        reject(new Error("ffmpeg is not installed (required for free-tier watermarks)."));
      } else {
        reject(err);
      }
    });
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg watermark failed (${code}): ${stderr.slice(-1500)}`));
    });
  });
}

/**
 * Paid exports = clean. Free / bonus-only accounts get a Pixovid watermark.
 * Unlock: any successful PURCHASE ledger row (Razorpay pack).
 */
export async function userNeedsWatermark(userId: string): Promise<boolean> {
  const paid = await prisma.creditTransaction.findFirst({
    where: { userId, type: "PURCHASE", amount: { gt: 0 } },
    select: { id: true },
  });
  return !paid;
}

function drawtextFilter(font: string | null, forVideo: boolean): string {
  const size = forVideo ? 28 : 36;
  // Semi-transparent brand mark, bottom-right, with a second diagonal-ish corner mark.
  const common = font
    ? `fontfile=${font}:fontcolor=white@0.55:borderw=1:bordercolor=black@0.35`
    : `fontcolor=white@0.55:borderw=1:bordercolor=black@0.35`;
  const main = `drawtext=${common}:fontsize=${size}:text='pixovid':x=w-tw-24:y=h-th-20`;
  const sub = `drawtext=${common}:fontsize=${Math.round(size * 0.55)}:text='FREE TIER':x=w-tw-24:y=h-th-20-${size + 8}`;
  return `${main},${sub}`;
}

/** Burn-in watermark on an MP4 buffer. Returns original buffer if ffmpeg fails (log + soft fail). */
export async function watermarkVideo(buffer: Buffer): Promise<Buffer> {
  const dir = await mkdtemp(join(tmpdir(), "wm-vid-"));
  const input = join(dir, "in.mp4");
  const output = join(dir, "out.mp4");
  try {
    await writeFile(input, buffer);
    const font = await fontFile();
    const vf = drawtextFilter(font, true);
    await runFfmpeg([
      "-i",
      input,
      "-vf",
      vf,
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "-c:a",
      "copy",
      "-movflags",
      "+faststart",
      output,
    ]);
    return await readFile(output);
  } catch (err) {
    console.warn("Video watermark skipped:", err instanceof Error ? err.message : err);
    return buffer;
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

/** Burn-in watermark on a still image buffer (png/jpeg/webp via ffmpeg). */
export async function watermarkImage(buffer: Buffer, contentType: string): Promise<Buffer> {
  const dir = await mkdtemp(join(tmpdir(), "wm-img-"));
  const ext =
    contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const input = join(dir, `in.${ext}`);
  const output = join(dir, `out.${ext}`);
  try {
    await writeFile(input, buffer);
    const font = await fontFile();
    const vf = drawtextFilter(font, false);
    const outArgs =
      ext === "png"
        ? ["-frames:v", "1", output]
        : ext === "webp"
          ? ["-frames:v", "1", "-quality", "90", output]
          : ["-frames:v", "1", "-q:v", "3", output];
    await runFfmpeg(["-i", input, "-vf", vf, ...outArgs]);
    return await readFile(output);
  } catch (err) {
    console.warn("Image watermark skipped:", err instanceof Error ? err.message : err);
    return buffer;
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

/**
 * Apply free-tier watermark when the user has never purchased credits.
 * No-ops (returns input) for paid accounts.
 */
export async function maybeWatermarkVideo(userId: string, buffer: Buffer): Promise<Buffer> {
  if (!(await userNeedsWatermark(userId))) return buffer;
  return watermarkVideo(buffer);
}

export async function maybeWatermarkImage(
  userId: string,
  buffer: Buffer,
  contentType: string,
): Promise<Buffer> {
  if (!(await userNeedsWatermark(userId))) return buffer;
  return watermarkImage(buffer, contentType);
}
