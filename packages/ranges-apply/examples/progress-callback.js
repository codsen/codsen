// Gather progress while applying multiple ranges

import { strict as assert } from "node:assert";

import { rApply } from "../dist/ranges-apply.esm.js";

const percentages = [];
const result = rApply(
  "abcdef",
  [
    [1, 2, "X"],
    [4, 5, "Y"],
  ],
  (percentage) => percentages.push(percentage),
);

assert.equal(result, "aXcdYf");
assert.deepEqual(percentages, [5, 10, 12, 19, 20, 60, 100]);
