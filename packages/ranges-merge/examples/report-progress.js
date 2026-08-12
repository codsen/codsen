import { strict as assert } from "node:assert";

import { rMerge } from "../dist/ranges-merge.esm.js";

const percentages = [];
const result = rMerge(
  [
    [1, 4],
    [3, 8],
    [10, 12],
    [11, 15],
  ],
  { progressFn: (percentage) => percentages.push(percentage) },
);

assert.deepEqual(result, [
  [1, 8],
  [10, 15],
]);
assert.equal(percentages.length > 0, true);
assert.equal(percentages.every(Number.isInteger), true);
