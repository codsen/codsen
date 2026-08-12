// Keep strings that contain no numeric chunks

import { strict as assert } from "node:assert";

import { groupStr } from "../dist/array-group-str-omit-num-char.esm.js";

assert.deepEqual(groupStr(["alpha", "beta", "alpha"]), {
  alpha: 1,
  beta: 1,
});
