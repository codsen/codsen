// Quick Take

import { strict as assert } from "assert";

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

// deleting key 'b' with value - array ['c', 'd']
assert.deepEqual(
  deleteKey(
    {
      a: { e: [{ b: ["c", "d"] }] },
      b: ["c", "d"],
    },
    {
      key: "b",
      val: ["c", "d"],
    },
  ),
  {},
);
// notice program cleaned after itself, it didn't leave empty "a" key
