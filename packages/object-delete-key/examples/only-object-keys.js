// Delete matching object keys without deleting matching array values

import { strict as assert } from "node:assert";

import { deleteKey } from "../dist/object-delete-key.esm.js";

assert.deepEqual(
  deleteKey(
    {
      a: "a",
      b: "keep",
      list: ["a"],
    },
    {
      key: "a",
      only: "object",
    },
  ),
  {
    b: "keep",
    list: ["a"],
  },
);
