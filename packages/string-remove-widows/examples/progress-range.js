// Map progress reports into a caller-owned percentage range

import { strict as assert } from "node:assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

const percentages = [];
removeWidows("a".repeat(2100), {
  reportProgressFunc: (percentage) => percentages.push(percentage),
  reportProgressFuncFrom: 20,
  reportProgressFuncTo: 30,
});

assert.equal(percentages[0], 20);
assert.equal(percentages.at(-1), 30);
assert.equal(
  percentages.every((value) => value >= 20 && value <= 30),
  true,
);
