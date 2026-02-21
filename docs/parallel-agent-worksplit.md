# Parallel Agent Worksplit

This repository is structured for parallel implementation.

## Ownership map
- Agent A: root workspace and CI scripts
- Agent B: `packages/core`
- Agent C: `packages/content`
- Agent D: `packages/tooling`
- Agent E: `apps/game-client`
- Agent F: `assets/source-prompts` and generated manifests

## Integration protocol
- Agents only edit owned paths.
- Shared interfaces live in `packages/core/src/contracts/types.ts`.
- Cross-package API changes require contract-first update + downstream sync.
