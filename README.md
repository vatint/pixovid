# Pixovid

**A Higgsfield-style generative media SaaS** — recreated from the open source project built in [Harkirat Singh’s “I Recreated Higgsfield From Scratch in 2 Hours”](https://www.youtube.com/watch?v=LuCXiNxZ1Dw) video, with UI/UX and aesthetic polish on top of the original.

Users sign in and can:

- **Generate videos** from a prompt with model, duration, resolution, aspect ratio, start/end frames and reference frames.
- **Generate images** from a prompt with model, resolution, aspect ratio and optional reference images.
- **Face swap** — upload a base image and a face (self-hosted FaceFusion).
- **Music-video templates** — admin timeline editor (Premiere-style), bake previews, export with avatar face-swap into long-form clips.
- **Credits & billing** — Razorpay-ready credit packs.

Video and image generation route through [OpenRouter](https://openrouter.ai/docs/guides/overview/multimodal/video-generation); face swaps run on [FaceFusion](https://docs.facefusion.io). Media lives in an S3-compatible store (MinIO locally).

## What’s in this replica

| Area | Detail |
| ---- | ------ |
| Product | Exact Pixovid feature set from the video (video, image, face swap, avatars, templates, admin bake, credits) |
| Stack | Turborepo monorepo, Bun, React + Vite + Tailwind v4, Express + better-auth, Prisma + Postgres |
| Aesthetics | Pure-black Higgsfield-style canvas, electric-lime CTAs, glass nav, showcase masonry, category filters, generation progress polish |

### Improvements over the stock UI

- Glass sticky navbar + mobile menu; Face Swap in primary nav
- Landing: brand gradient hero, capability strip, tool cards, category filters on the wall
- Clearer generation status badges and shimmer progress on in-flight jobs
- Meta/SEO title + description, package rename from legacy `video-arena`

## Architecture

| Path | Description |
| ---- | ----------- |
| `apps/frontend` | React + Vite + TypeScript SPA (Tailwind v4 + shadcn-style UI) |
| `apps/backend` | TypeScript + Express API — auth, OpenRouter, MinIO, templates, credits |
| `packages/db` | Prisma schema + client (Postgres) |
| `packages/typescript-config` / `eslint-config` | Shared tooling |
| `infra/facefusion` | Face-swap HTTP wrapper (Docker profile) |
| `spec/` | Spec-driven development notes from the original build |

Services via `docker-compose.yml`:

- **Postgres** — primary DB  
- **MinIO** — S3-compatible object store  
- **FaceFusion** — optional face-swap service (~5GB image)  
- **backend** / **frontend** — app containers  

## Prerequisites

- [Docker](https://www.docker.com/) + Docker Compose  
- [Bun](https://bun.sh) `>= 1.3` (local non-Docker development)  

## Quick start (full stack in Docker)

```sh
# 1. Configure environment
cp .env.example .env
# Optional: OPENROUTER_API_KEY, Google OAuth, Razorpay keys

# 2. Build & start
bun run docker:up        # docker compose up -d --build

# 3. Logs
bun run docker:logs
```

Once up:

| Service | URL |
| ------- | --- |
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:4000 (`/health`) |
| MinIO console | http://localhost:9001 (default `minioadmin`) |

Migrations apply automatically when the backend container starts.

```sh
bun run docker:down          # stop
bun run docker:reset         # stop + wipe volumes
```

### Face swap (FaceFusion)

Not started by default (large image). Enable with:

```sh
bun run docker:facefusion
```

Backend uses `FACEFUSION_URL` (default `http://localhost:7865`). First boot downloads models into a volume.

## Local development (apps on host, infra in Docker)

```sh
bun run infra:up             # Postgres + MinIO
bun install

cp packages/db/.env.example packages/db/.env
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
# Set BETTER_AUTH_SECRET in apps/backend/.env

bun run db:generate
bun run db:push
bun run dev
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:4000  

Google OAuth redirect URI:

```
http://localhost:4000/api/auth/callback/google
```

## Useful scripts

| Command | Description |
| ------- | ----------- |
| `bun run docker:up` | Full stack in Docker |
| `bun run docker:down` / `docker:reset` | Stop / wipe |
| `bun run docker:facefusion` | Start FaceFusion profile |
| `bun run infra:up` | Postgres + MinIO only |
| `bun run dev` | Hot-reload all apps |
| `bun run build` | Build monorepo |
| `bun run check-types` | Type-check |
| `bun run db:migrate` / `db:studio` | Prisma |

## Environment

See:

- `.env.example` (root, Docker Compose)
- `apps/backend/.env.example`
- `apps/frontend/.env.example`
- `packages/db/.env.example`

Without `OPENROUTER_API_KEY`, generation endpoints error; without Google OAuth credentials, Google sign-in stays disabled. Email/password auth still works.

## Credits

- Original product & open source: [codes30/pixovid](https://github.com/codes30/pixovid)  
- Tutorial: [I Recreated Higgsfield From Scratch in 2 Hours](https://www.youtube.com/watch?v=LuCXiNxZ1Dw) — Harkirat Singh / 100xDevs  
- Inspiration product: [Higgsfield](https://higgsfield.ai/)  

## License

See the upstream repository for licensing of the original source. This workspace is a local replica for development and learning.
