/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import sortBySubarray from "../dist/array-of-arrays-sort-by-col.esm.js";

// sort by second column, index number 1
assert.deepEqual(sortBySubarray([[1, 9, 4], [1], [1, 9, 3], [1, 9, 2]], 1), [
  [1, 9, 2],
  [1, 9, 3],
  [1, 9, 4],
  [1],
]);
