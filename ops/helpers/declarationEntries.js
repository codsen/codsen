import path from "node:path";

import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";

import { libraryEntries } from "./packageEntries.js";

// Compile the root once as the canonical, self-contained declaration bundle.
// For a subpath, Rollup discovers its actual source exports, then emits a
// generated facade back to that root. In particular this preserves unique
// symbol identity across root and subpath imports without authored .d.ts files.
function declarationEntries(manifest) {
  const entries = libraryEntries(manifest);
  const root = entries.find((entry) => entry.subpath === ".");
  if (!root.types) {
    throw new Error(`${manifest.name}: root declarations need a types export`);
  }
  const rootNames = new Set();
  return [root, ...entries.filter((entry) => entry !== root)].map((entry) => {
    if (!entry.types) {
      throw new Error(
        `${manifest.name}: ${entry.subpath} needs a types export`,
      );
    }
    return {
      input: entry.source,
      output: [{ file: entry.types, format: "es" }],
      plugins: [
        json(),
        dts(),
        {
          name: "canonical-declaration-identity",
          renderChunk(_code, chunk) {
            if (entry === root) {
              for (const name of chunk.exports) {
                rootNames.add(name);
              }
              return null;
            }
            const missing = chunk.exports.filter(
              (name) => !rootNames.has(name),
            );
            if (missing.length) {
              throw new Error(
                `${manifest.name}: ${entry.subpath} exports absent from root: ${missing.join(", ")}`,
              );
            }
            const relativeRoot = `./${path.posix.relative(path.posix.dirname(entry.types), root.types).replace(/\.d\.ts$/u, ".js")}`;
            return {
              code: `export { ${chunk.exports.join(", ")} } from ${JSON.stringify(relativeRoot)};\n`,
              map: null,
            };
          },
        },
      ],
    };
  });
}

export { declarationEntries };
