// Wildcards

import { strict as assert } from "node:assert";

import { deleteKey } from "../dist/object-delete-key.esm.js";

assert.deepEqual(
  deleteKey(
    {
      a: ["beep", "", "c", "boop"],
      bap: "bap",
    },
    {
      key: "b*p",
      only: "array",
    },
  ),
  {
    a: ["", "c"],
    bap: "bap",
  },
);
