// Extract a configured generation range

import { strict as assert } from "node:assert";

import { extractFromToSource } from "../dist/generate-atomic-css.esm.js";

assert.deepEqual(
  extractFromToSource(".m$$$[lang|=en] { margin: $$$px; } | 2 | 4"),
  [2, 4, ".m$$$[lang|=en] { margin: $$$px; }"],
);
