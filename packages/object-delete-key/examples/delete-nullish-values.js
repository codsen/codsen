// Delete null and undefined object values

import { strict as assert } from "node:assert";

import { deleteKey } from "../dist/object-delete-key.esm.js";

const source = {
  keep: "value",
  removeNull: null,
  nested: {
    keep: false,
    removeUndefined: undefined,
  },
};

assert.deepEqual(
  [deleteKey(source, { val: null }), deleteKey(source, { val: undefined })],
  [
    {
      keep: "value",
      nested: { keep: false, removeUndefined: undefined },
    },
    {
      keep: "value",
      removeNull: null,
      nested: { keep: false },
    },
  ],
);
