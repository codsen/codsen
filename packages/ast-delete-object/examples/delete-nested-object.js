// Delete a matching object nested under another object

import { strict as assert } from "node:assert";

import { deleteObj } from "../dist/ast-delete-object.esm.js";

assert.deepEqual(
  deleteObj(
    {
      title: "Example",
      metadata: { internal: true, owner: "Docs" },
    },
    { internal: true },
  ),
  { title: "Example" },
);
