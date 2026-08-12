// Delete empty objects throughout a tree

import { strict as assert } from "node:assert";

import { deleteObj } from "../dist/ast-delete-object.esm.js";

assert.deepEqual(deleteObj([{}, { content: "kept" }, {}], {}), [
  { content: "kept" },
]);
