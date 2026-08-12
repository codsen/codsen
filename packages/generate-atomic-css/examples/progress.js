// Observe generation progress in a custom interval

import { strict as assert } from "node:assert";

import { genAtomic } from "../dist/generate-atomic-css.esm.js";

const progress = [];
const { log } = genAtomic(".m$$$ { margin: $$$px; } | 1 | 2", {
  includeConfig: false,
  includeHeadsAndTails: false,
  reportProgressFunc: (percentage) => progress.push(percentage),
  reportProgressFuncFrom: 20,
  reportProgressFuncTo: 40,
});

assert.equal(log.count, 2);
assert.equal(progress.length, 2);
assert.equal(progress.every(Number.isFinite), true);
