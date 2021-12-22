// Disable the cleanup which would otherwise happen after deletion

import { strict as assert } from "assert";

import { deleteKey } from "../dist/object-delete-key.esm.js";

assert.deepEqual(
  deleteKey(
    {
      a: { e: [{ b: { c: "d" } }] },
      b: { c: "d" },
    },
    {
      key: "b",
      val: { c: "d" },
      cleanup: false,
    }
  ),
  { a: { e: [{}] } }
);
