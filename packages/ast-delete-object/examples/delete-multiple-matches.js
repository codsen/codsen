// Delete every object that contains the requested pair

import { strict as assert } from "node:assert";

import { deleteObj } from "../dist/ast-delete-object.esm.js";

assert.deepEqual(
  deleteObj(
    [
      { remove: true, id: 1 },
      { remove: false, id: 2 },
      { remove: true, id: 3 },
    ],
    { remove: true },
  ),
  [{ remove: false, id: 2 }],
);
