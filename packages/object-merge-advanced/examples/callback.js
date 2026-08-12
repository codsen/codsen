// Override a merge result in the callback

import { strict as assert } from "node:assert";

import { mergeAdvanced } from "../dist/object-merge-advanced.esm.js";

assert.deepEqual(
  mergeAdvanced(
    { label: "old" },
    { label: "new" },
    {
      cb: (left, right, result, info) =>
        info.key === "label" ? `${left}/${right}` : result,
    },
  ),
  { label: "old/new" },
);
