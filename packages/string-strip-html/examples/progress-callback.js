// Map progress reporting into a custom percentage range

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

const percentages = [];
const result = stripHtml("<em>a</em>".repeat(150), {
  reportProgressFunc: (percentage) => percentages.push(percentage),
  reportProgressFuncFrom: 80,
  reportProgressFuncTo: 100,
});

assert.equal(result.result, "a".repeat(150));
assert.deepEqual(percentages, [90]);
