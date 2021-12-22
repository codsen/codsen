// Quick Take

import { strict as assert } from "assert";

import { sortByCol } from "../dist/array-of-arrays-sort-by-col.esm.js";

// sort by second column, index number 1
assert.deepEqual(sortByCol([[1, 9, 4], [1], [1, 9, 3], [1, 9, 2]], 1), [
  [1, 9, 2],
  [1, 9, 3],
  [1, 9, 4],
  [1],
]);
