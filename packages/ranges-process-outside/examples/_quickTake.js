/* eslint-disable no-unused-vars */
// Quick Take

import { strict as assert } from "assert";

import { rProcessOutside } from "../dist/ranges-process-outside.esm.js";

const gathered = [];

// a callback interface:
rProcessOutside(
  "abcdefghij",
  [
    [1, 5], // delete from "b" to "f"
  ],
  (fromIdx, toIdx, offsetValueCb) => {
    gathered.push(fromIdx);
  },
);

assert.deepEqual(gathered, [0, 5, 6, 7, 8, 9]);
