import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

interface AssetPromptSpec {
  id: string;
  category: string;
  prompt: string;
  scene?: string;
  subject?: string;
  style?: string;
  composition?: string;
  lighting?: string;
  palette?: string;
  materials?: string;
  constraints: string;
  avoid?: string;
  outputName: string;
  background?: "transparent" | "opaque" | "auto";
  outputFormat?: "png" | "webp";
}

interface AssetPlan {
  styleTag: string;
  useCase: string;
  defaults: {
    size: string;
    quality: "low" | "medium" | "high" | "auto";
    background?: "transparent" | "opaque" | "auto";
    outputFormat?: "png" | "webp";
  };
  assets: AssetPromptSpec[];
}

interface ManifestEntry {
  id: string;
  category: string;
  styleTag: string;
  promptHash: string;
  sourcePath: string;
  outputPath: string;
  license: string;
  revision: number;
}

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "../../..");
const ASSET_PLAN_PATH = resolve(ROOT, "assets/source-prompts/asset-plan.yaml");
const OUT_DIR = resolve(ROOT, "tmp/imagegen");
const OUT_FILE = resolve(OUT_DIR, "jobs.jsonl");
const MANIFEST_PATH = resolve(ROOT, "assets/generated/manifest.json");

function stableHash(raw: string): string {
  return createHash("sha1").update(raw).digest("hex").slice(0, 10);
}

function loadManifestById(): Record<string, ManifestEntry> {
  if (!existsSync(MANIFEST_PATH)) {
    return {};
  }

  const existing = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8")) as ManifestEntry[];
  return Object.fromEntries(existing.map((entry) => [entry.id, entry]));
}

function main(): void {
  const raw = readFileSync(ASSET_PLAN_PATH, "utf-8");
  const parsed = parse(raw) as AssetPlan;
  const existingManifest = loadManifestById();

  const rows = parsed.assets.map((entry) => {
    const promptHash = stableHash(
      `${parsed.styleTag}:${entry.prompt}:${entry.constraints}:${entry.style ?? ""}:${entry.palette ?? ""}`
    );
    return {
      prompt: entry.prompt,
      use_case: parsed.useCase,
      scene: entry.scene,
      subject: entry.subject,
      style: entry.style,
      composition: entry.composition,
      lighting: entry.lighting,
      palette: entry.palette,
      materials: entry.materials,
      constraints: entry.constraints,
      negative: entry.avoid,
      size: parsed.defaults.size,
      quality: parsed.defaults.quality,
      background: entry.background ?? parsed.defaults.background,
      output_format: entry.outputFormat ?? parsed.defaults.outputFormat,
      output_name: entry.outputName,
      out: entry.outputName,
      metadata: {
        id: entry.id,
        category: entry.category,
        styleTag: parsed.styleTag,
        promptHash
      }
    };
  });

  const manifest: ManifestEntry[] = rows.map((row) => {
    const previous = existingManifest[row.metadata.id];
    const revision =
      previous === undefined
        ? 1
        : previous.promptHash === row.metadata.promptHash
          ? previous.revision
          : previous.revision + 1;

    return {
      id: row.metadata.id,
      category: row.metadata.category,
      styleTag: row.metadata.styleTag,
      promptHash: row.metadata.promptHash,
      sourcePath: "assets/source-prompts/asset-plan.yaml",
      outputPath: `apps/game-client/public/generated/${row.out}`,
      license: "generated-original",
      revision
    };
  });

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(
    OUT_FILE,
    rows.map((row) => JSON.stringify(row)).join("\n") + "\n",
    "utf-8"
  );
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf-8");

  process.stdout.write(`Wrote ${rows.length} jobs to ${OUT_FILE}\n`);
  process.stdout.write(`Synced manifest to ${MANIFEST_PATH}\n`);
}

main();
