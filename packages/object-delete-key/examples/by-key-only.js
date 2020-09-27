/* eslint import/extensions:0 */

// Deletion by the key only

import { strict as assert } from "assert";
import deleteKey from "../dist/object-delete-key.esm.js";

assert.deepEqual(
  deleteKey(
    {
      a: "a",
      b: "jlfghdjkhkdfhgdf",
      c: [{ b: "weuhreorhelhgljdhflghd" }],
    },
    {
      key: "b",
    }
  ),
  { a: "a" }
);
