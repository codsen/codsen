import { strict as assert } from "node:assert";

import { rMerge } from "../dist/ranges-merge.esm.js";

assert.deepEqual(
  rMerge([
    [1, 5],
    [2, 10],
  ]),
  [[1, 10]],
);
