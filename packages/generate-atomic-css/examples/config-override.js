// Generate from a separate configuration string

import { strict as assert } from "node:assert";

import { genAtomic } from "../dist/generate-atomic-css.esm.js";

assert.equal(
  genAtomic("body { color: red; }", {
    includeConfig: false,
    includeHeadsAndTails: false,
    pad: false,
    configOverride: ".m$$$ { margin: $$$px; } | 1 | 2",
  }).result,
  ".m1 { margin: 1px; }\n.m2 { margin: 2px; }\n",
);
