/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import mergeR from "../dist/ranges-merge.esm.js";

// joining edges:
assert.deepEqual(
  mergeR([
    [1, 2],
    [2, 3],
    [9, 10],
  ]),
  [
    [1, 3],
    [9, 10],
  ]
);

// an overlap:
assert.deepEqual(
  mergeR([
    [1, 5],
    [2, 10],
  ]),
  [[1, 10]]
);
