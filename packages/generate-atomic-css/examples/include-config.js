// Retain the generator configuration

import { strict as assert } from "node:assert";

import { genAtomic } from "../dist/generate-atomic-css.esm.js";

const result = genAtomic(".m$$$ { margin: $$$px; } | 1 | 2", {
  includeConfig: true,
  includeHeadsAndTails: true,
  pad: false,
}).result;

assert.equal(result.includes("GENERATE-ATOMIC-CSS-CONFIG-STARTS"), true);
assert.equal(result.includes(".m$$$ { margin: $$$px; } | 1 | 2"), true);
assert.equal(result.includes(".m2 { margin: 2px; }"), true);
