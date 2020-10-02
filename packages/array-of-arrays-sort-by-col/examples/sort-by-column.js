/* eslint import/extensions:0 */

// Sort by certain column

import { strict as assert } from "assert";
import sortBySubarray from "../dist/array-of-arrays-sort-by-col.esm.js";

// Sort by a second element (column index === 1):
assert.deepEqual(sortBySubarray([[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]], 1), [
  [1, 7, 5],
  [1, 8, 2],
  [1, 9, 0],
  [1],
]);
// notice 7-8-9
