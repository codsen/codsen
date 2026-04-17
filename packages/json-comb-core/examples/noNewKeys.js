// Synchronous `noNewKeysSync()` - example #1

import { strict as assert } from "node:assert";

import {
  enforceKeyset,
  enforceKeysetSync,
  findUnusedSync,
  getKeyset,
  getKeysetSync,
  noNewKeysSync,
  sortAllObjectsSync,
} from "../dist/json-comb-core.esm.js";

// We are going to catch the rogue key `b`:

assert.deepEqual(
  noNewKeysSync(
    {
      // <- input we're checking
      a: "a",
      b: "b",
      c: "c",
    },
    {
      // <- reference keyset
      a: "aaa",
      c: "ccc",
    },
  ),
  ["b"], // list of rogue paths
);
