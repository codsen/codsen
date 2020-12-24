// Quick Take

import { strict as assert } from "assert";
import { deleteObj } from "../dist/ast-delete-object.esm.js";

// if all keys in source object match target object's keys, the
// source object gets deleted:
assert.deepEqual(
  deleteObj(
    [
      "elem1",
      {
        findme1: "zzz",
        findme2: "yyy",
        somethingelse: "qqq",
      },
      "elem2",
    ],
    {
      findme1: "zzz",
      findme2: "yyy",
    }
  ),
  ["elem1", "elem2"]
);
