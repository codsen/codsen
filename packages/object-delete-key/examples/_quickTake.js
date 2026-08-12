// Quick Take

import { strict as assert } from "node:assert";

import { deleteKey } from "../dist/object-delete-key.esm.js";

// deleting key 'c', with value 'd'
assert.deepEqual(
  deleteKey(
    {
      a: "b",
      c: "d",
    },
    {
      key: "c",
      val: "d",
    },
  ),
  { a: "b" },
);
