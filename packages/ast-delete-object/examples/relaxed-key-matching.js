// Delete an object that contains additional keys

import { strict as assert } from "node:assert";

import { deleteObj } from "../dist/ast-delete-object.esm.js";

const source = [
  "before",
  { findme1: "zzz", findme2: "yyy", additional: "value" },
  "after",
];

assert.deepEqual(
  deleteObj(
    source,
    { findme1: "zzz", findme2: "yyy" },
    { matchKeysStrictly: false },
  ),
  ["before", "after"],
);
