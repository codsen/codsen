// Keep the touching ranges separate

import { strict as assert } from "node:assert";

import { rMerge } from "../dist/ranges-merge.esm.js";

assert.deepEqual(
  rMerge(
    [
      [1, 3, "a"],
      [3, 6, "b"],
    ],
    { joinRangesThatTouchEdges: false },
  ),
  [
    [1, 3, "a"],
    [3, 6, "b"],
  ],
);
