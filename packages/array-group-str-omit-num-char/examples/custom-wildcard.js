// Use a custom wildcard in grouped patterns

import { strict as assert } from "node:assert";

import { groupStr } from "../dist/array-group-str-omit-num-char.esm.js";

assert.deepEqual(
  groupStr(["width-1", "width-2", "height-1", "height-2"], {
    wildcard: "{n}",
  }),
  {
    "width-{n}": 2,
    "height-{n}": 2,
  },
);
