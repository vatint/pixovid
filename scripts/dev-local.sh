#!/usr/bin/env bash
# Start Pixovid without Docker: portable Postgres + MinIO + Bun apps.
# First run downloads Postgres/MinIO into .tools/ (~150MB).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TOOLS="$ROOT/.tools"
export PATH="${HOME}/.bun/bin:$TOOLS/pgsql/bin:$PATH"
export LD_LIBRARY_PATH="$TOOLS/pgsql/lib:${LD_LIBRARY_PATH:-}"
export MINIO_ROOT_USER="${MINIO_ROOT_USER:-minioadmin}"
export MINIO_ROOT_PASSWORD="${MINIO_ROOT_PASSWORD:-minioadmin}"

mkdir -p "$TOOLS/logs" "$TOOLS/minio-data" "$TOOLS/pgsocket"

need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing required tool: $1"; exit 1; }; }
need curl
need bun
need openssl

ensure_binaries() {
  if [ ! -x "$TOOLS/minio" ]; then
    echo "→ Downloading MinIO…"
    curl -fsSL -o "$TOOLS/minio" https://dl.min.io/server/minio/release/linux-amd64/minio
    chmod +x "$TOOLS/minio"
  fi
  if [ ! -x "$TOOLS/mc" ]; then
    curl -fsSL -o "$TOOLS/mc" https://dl.min.io/client/mc/release/linux-amd64/mc
    chmod +x "$TOOLS/mc"
  fi
  if [ ! -x "$TOOLS/pgsql/bin/postgres" ]; then
    echo "→ Downloading PostgreSQL 16 binaries…"
    local jar="$TOOLS/pg-binaries.jar"
    curl -fsSL -o "$jar" \
      "https://repo1.maven.org/maven2/io/zonky/test/postgres/embedded-postgres-binaries-linux-amd64/16.6.0/embedded-postgres-binaries-linux-amd64-16.6.0.jar"
    mkdir -p "$TOOLS/pg-extract" "$TOOLS/pgsql"
    (cd "$TOOLS/pg-extract" && unzip -o -q "$jar")
    tar -xJf "$TOOLS/pg-extract/postgres-linux-x86_64.txz" -C "$TOOLS/pgsql"
  fi
}

ensure_env() {
  if [ ! -f "$ROOT/packages/db/.env" ]; then
    cat >"$ROOT/packages/db/.env" <<'EOF'
DATABASE_URL="postgresql://postgres@localhost:5432/video_arena?schema=public"
EOF
  fi
  if [ ! -f "$ROOT/apps/frontend/.env" ]; then
    echo 'VITE_API_URL=http://localhost:4000' >"$ROOT/apps/frontend/.env"
  fi
  if [ ! -f "$ROOT/apps/backend/.env" ]; then
    local secret
    secret="$(openssl rand -base64 32)"
    cat >"$ROOT/apps/backend/.env" <<EOF
NODE_ENV=development
PORT=4000
BACKEND_URL=http://localhost:4000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres@localhost:5432/video_arena?schema=public
BETTER_AUTH_SECRET=$secret
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ADMIN_EMAILS=
SUPERADMIN_EMAILS=
OPENROUTER_API_KEY=
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
SWAP_PROVIDER=facefusion
FACEFUSION_URL=http://localhost:7865
MINIO_ENDPOINT=localhost
MINIO_FRONTEND_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=video-arena
EOF
    echo "→ Wrote apps/backend/.env (set OPENROUTER_API_KEY for generation)"
  fi
}

start_postgres() {
  if ! ss -tln 2>/dev/null | grep -q ':5432' && ! netstat -tln 2>/dev/null | grep -q ':5432'; then
    if [ ! -f "$TOOLS/pgdata/PG_VERSION" ]; then
      echo "→ Initializing Postgres data directory…"
      initdb -D "$TOOLS/pgdata" --username=postgres --auth=trust --encoding=UTF8 --locale=C
    fi
    echo "→ Starting Postgres on :5432…"
    pg_ctl -D "$TOOLS/pgdata" -l "$TOOLS/logs/postgres.log" -o "-p 5432" start
    sleep 1
  else
    echo "→ Postgres already listening on :5432"
  fi

  # Ensure database exists (uses bun + pg)
  (cd "$ROOT/packages/db" && bun -e '
const { Client } = require("pg");
(async () => {
  const c = new Client({ connectionString: "postgresql://postgres@localhost:5432/postgres" });
  await c.connect();
  const r = await c.query("SELECT 1 FROM pg_database WHERE datname = \$1", ["video_arena"]);
  if (r.rowCount === 0) {
    await c.query("CREATE DATABASE video_arena");
    console.log("created database video_arena");
  }
  await c.end();
})().catch((e) => { console.error(e); process.exit(1); });
' 2>/dev/null || true)
}

start_minio() {
  if ! ss -tln 2>/dev/null | grep -q ':9000' && ! netstat -tln 2>/dev/null | grep -q ':9000'; then
    echo "→ Starting MinIO on :9000…"
    nohup "$TOOLS/minio" server "$TOOLS/minio-data" --address ":9000" --console-address ":9001" \
      >"$TOOLS/logs/minio.log" 2>&1 &
    echo $! >"$TOOLS/minio.pid"
    sleep 2
  else
    echo "→ MinIO already listening on :9000"
  fi
  "$TOOLS/mc" alias set local http://127.0.0.1:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" >/dev/null 2>&1 || true
  "$TOOLS/mc" mb -p local/video-arena >/dev/null 2>&1 || true
  "$TOOLS/mc" anonymous set download local/video-arena >/dev/null 2>&1 || true
}

echo "Pixovid local stack"
ensure_binaries
ensure_env

if [ ! -d "$ROOT/node_modules" ]; then
  echo "→ bun install…"
  (cd "$ROOT" && bun install)
fi

start_postgres
start_minio

echo "→ prisma generate + db push…"
(cd "$ROOT" && bun run db:generate && bun run db:push)

echo "→ starting backend + frontend…"
(cd "$ROOT" && bun run dev)
