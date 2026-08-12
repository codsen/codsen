// Delete the root object when it contains the requested key-value pairs

import { strict as assert } from "node:assert";

import { deleteObj } from "../dist/ast-delete-object.esm.js";

assert.deepEqual(
  deleteObj({ status: "draft", title: "Example" }, { status: "draft" }),
  {},
);
