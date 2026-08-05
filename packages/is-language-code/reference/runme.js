// Reads the checked-in IANA language-subtag registry and regenerates src JSON.
// -----------------------------------------------------------------------------

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parseRegistry } from "./parseRegistry.js";

const referenceDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.dirname(referenceDir);
const sourceDir = path.join(packageDir, "src");
const registryPath = path.join(referenceDir, "language-subtag-registry.txt");
const ianaSpec = fs.readFileSync(registryPath, "utf8");
const { prefixes, ranged, types, valuesByType } = parseRegistry(ianaSpec);
const generatedFiles = [];

function writeJson(fileName, value) {
  const filePath = path.join(sourceDir, fileName);
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
  generatedFiles.push(filePath);
}

for (const type of types) {
  writeJson(`tag_${type}.json`, valuesByType[type]);
}

writeJson("tag_prefixes.json", prefixes);
writeJson("tag_ranged.json", ranged);
writeJson("tag_types.json", types);

const biomeExecutable = path.join(
  packageDir,
  "..",
  "..",
  "node_modules",
  ".bin",
  process.platform === "win32" ? "biome.cmd" : "biome",
);
execFileSync(biomeExecutable, ["format", "--write", ...generatedFiles], {
  stdio: "ignore",
});

console.log(
  `${registryPath}: generated ${types.length + 3} JSON files from ${ianaSpec.match(/^File-Date: (.+)$/m)?.[1] ?? "an unknown registry date"}.`,
);
