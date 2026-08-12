// Deletion by the value only

import { strict as assert } from "node:assert";

import { deleteKey } from "../dist/object-delete-key.esm.js";

assert.deepEqual(
  deleteKey(
    {
      a: "a",
      skldjfslfl: "x",
      c: [{ dlfgjdlkjlfgjhfg: "x" }],
    },
    {
      val: "x",
    },
  ),
  { a: "a" },
);
