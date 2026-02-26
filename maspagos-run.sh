#!/usr/bin/env bash
set -euo pipefail

# chmod +x maspagos-git-download.sh
# chmod +x maspagos-run.sh

HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-4203}"

# Path a la lib local (ajustalo si tu repo tiene otra estructura)
LIB_PATH="../ng-libs-local/mma-sso-session-guard-1-0.0.tgz"

# Si usás nvm en Mac
command -v nvm >/dev/null 2>&1 && nvm use || true

echo "==> Repo: $(pwd)"

# deps del proyecto (si preferís siempre limpio, dejalo; si no, lo podés comentar)
echo "==> npm install (app deps)"
npm ci || npm install

echo "==> Installing (FORCED) local lib from: $LIB_PATH"
npm install "$LIB_PATH" --force

echo "==> ng build"
npx ng build

echo "==> ng serve --host=$HOST --ssl --port=$PORT"
exec npx ng serve --host="$HOST" --ssl --port="$PORT"