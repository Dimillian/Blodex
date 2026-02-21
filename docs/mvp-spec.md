# Blodex MVP Spec

## Goal
Deliver a local-playable browser ARPG vertical slice with deterministic systems and a reproducible art pipeline.

## Included
- Isometric seeded dungeon generation (rooms + corridors)
- Click-to-move player controls
- Three enemy archetypes with chase/attack AI
- Player combat + monster combat
- Loot drops and inventory/equipment
- XP gain and leveling per run
- Run end summary and run reset
- Local meta progression (`runsPlayed`, `bestFloor`, `bestTimeMs`)

## Excluded
- Multiplayer
- Backend profiles
- Multi-biome campaign
- Persistent run gear/XP

## Acceptance Checks
- `pnpm test` passes
- Game starts with `pnpm dev`
- One full run can be completed and restarted without page reload
