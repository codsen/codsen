// Count duplicate strings instead of deduplicating them

import { strict as assert } from "node:assert";

import { groupStr } from "../dist/array-group-str-omit-num-char.esm.js";

assert.deepEqual(
  groupStr(["item-1", "item-1", "item-1"], {
    dedupePlease: false,
  }),
  {
    "item-1": 3,
  },
);
