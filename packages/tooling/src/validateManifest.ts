import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "../../..");
const MANIFEST_PATH = resolve(ROOT, "assets/generated/manifest.json");

interface AssetManifestEntry {
  id: string;
  category: string;
  styleTag: string;
  promptHash: string;
  sourcePath: string;
  outputPath: string;
  license: string;
  revision: number;
}

function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function main(): void {
  const entries = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8")) as AssetManifestEntry[];

  assert(Array.isArray(entries), "Manifest must be an array.");
  assert(entries.length > 0, "Manifest must contain at least one asset entry.");

  const ids = new Set<string>();

  for (const entry of entries) {
    assert(typeof entry.id === "string" && entry.id.length > 0, "Entry id is required.");
    assert(!ids.has(entry.id), `Duplicate asset id: ${entry.id}`);
    ids.add(entry.id);
    assert(typeof entry.styleTag === "string" && entry.styleTag.length > 0, `styleTag missing on ${entry.id}`);
    assert(typeof entry.promptHash === "string" && entry.promptHash.length >= 8, `promptHash invalid on ${entry.id}`);
    assert(typeof entry.outputPath === "string" && entry.outputPath.length > 0, `outputPath missing on ${entry.id}`);
    assert(Number.isInteger(entry.revision) && entry.revision > 0, `revision invalid on ${entry.id}`);
  }

  process.stdout.write(`Manifest valid: ${entries.length} entries\n`);
}

main();
