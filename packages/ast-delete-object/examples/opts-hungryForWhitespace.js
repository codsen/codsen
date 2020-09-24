/* eslint import/extensions:0 */

// opts.matchKeysStrictly

import { strict as assert } from "assert";
import deleteObj from "../dist/ast-delete-object.esm.js";

assert.deepEqual(
  deleteObj(
    [
      { a: "\n" }, // that's empty
      {
        key3: "val3",
        key4: "val4",
      },
      { b: "   " }, // that's empty
      { c: "" }, // that's empty
    ],
    {}, // empty thing to match again - we match "empty" vs "empty"
    { matchKeysStrictly: false, hungryForWhitespace: true }
  ),
  [
    {
      key3: "val3",
      key4: "val4",
    },
  ]
);

// but
assert.deepEqual(
  deleteObj(
    [
      { a: "\n" }, // that's empty
      {
        key3: "val3",
        key4: "val4",
      },
      { b: "   " }, // that's empty
      { c: "" }, // that's empty
    ],
    {}, // empty thing to match again - we match "empty" vs "empty"
    { matchKeysStrictly: false, hungryForWhitespace: false }
  ),
  [
    { a: "\n" },
    {
      key3: "val3",
      key4: "val4",
    },
    { b: "   " },
    { c: "" },
  ]
);
// nothing happened because empty things were matched strictly, "==="
