/* eslint import/extensions:0, no-unused-vars:0 */

// Quick Take

import { strict as assert } from "assert";
import processOutside from "../dist/ranges-process-outside.esm.js";

const gathered = [];

// a callback interface:
processOutside(
  "abcdefghij",
  [
    [1, 5], // delete from "b" to "f"
  ],
  (fromIdx, toIdx, offsetValueCb) => {
    gathered.push(fromIdx);
  }
);

assert.deepEqual(gathered, [0, 5, 6, 7, 8, 9]);
