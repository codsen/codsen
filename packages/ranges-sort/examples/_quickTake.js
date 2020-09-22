/* eslint import/extensions:0, no-unused-vars:0 */

// Quick Take

import { strict as assert } from "assert";
import rsort from "../dist/ranges-sort.esm.js";

// Ranges (see codsen.com/ranges/) are sorted:
assert.deepEqual(
  rsort([
    [2, 3],
    [9, 10, "bad grey wolf"],
    [1, 2],
  ]),
  [
    [1, 2],
    [2, 3],
    [9, 10, "bad grey wolf"],
  ]
);
