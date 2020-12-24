// `opts.matchKeysStrictly`

import { strict as assert } from "assert";
import { deleteObj } from "../dist/ast-delete-object.esm.js";

const source = [
  "elem1",
  {
    findme1: "zzz",
    findme2: "yyy",
    somethingelse: "qqq", // <--- this key will block deletion
  },
  "elem2",
];

// nothing happens - matching was strict
assert.deepEqual(
  deleteObj(
    source,
    {
      findme1: "zzz",
      findme2: "yyy",
    },
    {
      matchKeysStrictly: true, // <--- strict matching
    }
  ),
  source
);

// but
assert.deepEqual(
  deleteObj(
    source,
    {
      findme1: "zzz",
      findme2: "yyy",
    },
    {
      matchKeysStrictly: false,
    }
  ),
  ["elem1", "elem2"]
);
