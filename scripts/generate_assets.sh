#!/usr/bin/env bash
set -euo pipefail

CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
IMAGE_GEN="$CODEX_HOME/skills/imagegen/scripts/image_gen.py"

if [[ ! -f "$IMAGE_GEN" ]]; then
  echo "Missing image_gen.py at $IMAGE_GEN" >&2
  exit 1
fi

mkdir -p output/imagegen/raw apps/game-client/public/generated

uv run --with openai --with pillow python3 "$IMAGE_GEN" generate-batch \
  --input tmp/imagegen/jobs.jsonl \
  --out-dir output/imagegen/raw \
  --concurrency 4 \
  --force

cp output/imagegen/raw/*.png apps/game-client/public/generated/
cp assets/generated/manifest.json apps/game-client/public/generated/manifest.json

echo "Generated assets copied into apps/game-client/public/generated"
