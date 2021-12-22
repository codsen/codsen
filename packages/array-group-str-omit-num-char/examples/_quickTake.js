// Quick Take

import { strict as assert } from "assert";

import { groupStr } from "../dist/array-group-str-omit-num-char.esm.js";

assert.deepEqual(groupStr(["a1-1", "a2-2", "b3-3", "c4-4"]), {
  "a*-*": 2,
  "b3-3": 1,
  "c4-4": 1,
});
