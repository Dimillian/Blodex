# Blodex

Isometric fantasy hack-and-slash MVP built with Phaser + TypeScript in a pnpm workspace.

## Quick start

```bash
pnpm install
pnpm dev
```

## Workspace

- `apps/game-client`: browser game client (Phaser + Vite)
- `packages/core`: deterministic game systems and contracts
- `packages/content`: game content data (items, monsters, loot)
- `packages/tooling`: asset pipeline scripts and manifest validation

## Scripts

- `pnpm dev`: run game locally
- `pnpm test`: run core tests
- `pnpm build`: build all packages
- `pnpm check`: TypeScript checks
- `pnpm assets:compile`: compile image generation jobs from asset plan
- `pnpm assets:generate`: generate game art via imagegen and copy to client public assets
- `pnpm assets:validate`: validate generated asset manifest

See `docs/mvp-spec.md` and `docs/art-style-bible.md` for product and art pipeline details.

## Imagegen pipeline

`pnpm assets:generate` expects `OPENAI_API_KEY` in your environment and uses:

- `assets/source-prompts/asset-plan.yaml` as source of truth
- `tmp/imagegen/jobs.jsonl` as compiled batch jobs
- `assets/generated/manifest.json` as registry and revision tracking
- `apps/game-client/public/generated/*` as runtime asset output
