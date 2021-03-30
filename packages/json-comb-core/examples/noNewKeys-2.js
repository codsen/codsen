// Synchronous `noNewKeysSync()` - example #2

import { strict as assert } from "assert";
import {
  getKeysetSync,
  getKeyset,
  enforceKeyset,
  enforceKeysetSync,
  sortAllObjectsSync,
  noNewKeysSync,
  findUnusedSync,
} from "../dist/json-comb-core.esm.js";

assert.deepEqual(
  noNewKeysSync(
    {
      // <- input we're checking
      z: [
        {
          a: "a",
          b: "b",
          c: "c",
        },
        {
          a: false,
          b: false,
          c: "c",
        },
      ],
    },
    {
      // <- reference keyset
      z: [
        {
          a: "a",
          b: "b",
        },
        {
          a: false,
          b: false,
        },
      ],
    }
  ),
  ["z[0].c", "z[1].c"]
);
