// Handle an empty CSV string

import { strict as assert } from "node:assert";

import { sort } from "../dist/csv-sort.esm.js";

assert.deepEqual(sort(""), {
  res: [[""]],
  msgContent: null,
  msgType: null,
});
