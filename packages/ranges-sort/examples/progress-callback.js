// Observe sorting progress

import { strict as assert } from "node:assert";

import { rSort } from "../dist/ranges-sort.esm.js";

const percentages = [];
const result = rSort(
  [
    [3, 4],
    [1, 2],
    [2, 3],
  ],
  { progressFn: (percentage) => percentages.push(percentage) },
);

assert.deepEqual(result, [
  [1, 2],
  [2, 3],
  [3, 4],
]);
assert.equal(percentages[percentages.length - 1], 100);
assert.equal(
  percentages.every(
    (percentage, index) => index === 0 || percentage > percentages[index - 1],
  ),
  true,
);
