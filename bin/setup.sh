#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ ! -f "$ROOT_DIR/.env" ]; then
  cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
  echo "Created .env from .env.example"
fi

# Prompt for MISTRAL_API_KEY
CURR_KEY="$(grep -E '^MISTRAL_API_KEY=' "$ROOT_DIR/.env" | cut -d= -f2-)"
if [ -z "$CURR_KEY" ]; then
  read -rp "Enter your Mistral API key: " KEY
  KEY_ESCAPED=$(printf '%s\n' "$KEY" | sed -e 's/[\/&]/\\&/g')
  sed -i.bak -E "s/^MISTRAL_API_KEY=.*/MISTRAL_API_KEY=$KEY_ESCAPED/" "$ROOT_DIR/.env"
  rm -f "$ROOT_DIR/.env.bak"
  echo "Saved MISTRAL_API_KEY to .env"
else
  echo "MISTRAL_API_KEY already set in .env"
fi

echo "Done. You can now run:  docker compose up --build"
