// Delete only when both the key and value match

import { strict as assert } from "node:assert";

import { deleteKey } from "../dist/object-delete-key.esm.js";

assert.deepEqual(
  deleteKey(
    {
      a: "remove",
      b: "keep",
      nested: { a: "keep" },
    },
    {
      key: "a",
      val: "remove",
    },
  ),
  {
    b: "keep",
    nested: { a: "keep" },
  },
);
