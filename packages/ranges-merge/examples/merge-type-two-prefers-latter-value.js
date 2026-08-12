import { strict as assert } from "node:assert";

import { rMerge } from "../dist/ranges-merge.esm.js";

assert.deepEqual(
  rMerge(
    [
      [3, 4, "short"],
      [3, 12, "long"],
    ],
    { mergeType: 2 },
  ),
  [[3, 12, "long"]],
);
