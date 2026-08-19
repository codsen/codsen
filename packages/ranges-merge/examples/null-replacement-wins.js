// A `null` replacement wins over text

import { strict as assert } from "node:assert";

import { rMerge } from "../dist/ranges-merge.esm.js";

assert.deepEqual(
  rMerge([
    [1, 4, null],
    [3, 8, "text"],
  ]),
  [[1, 8, null]],
);
