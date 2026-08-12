// Preserve numeric chunks that stay constant across a group

import { strict as assert } from "node:assert";

import { groupStr } from "../dist/array-group-str-omit-num-char.esm.js";

assert.deepEqual(
  groupStr(["width425-margin1px", "width425-margin2px", "width425-margin3px"]),
  {
    "width425-margin*px": 3,
  },
);
