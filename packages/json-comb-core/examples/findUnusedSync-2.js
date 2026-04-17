// Synchronous `findUnusedSync()` - example #2

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

// This function will work on arrays of both normalised and not normalised object sets.
assert.deepEqual(
  findUnusedSync([
    {
      a: [
        {
          k: false,
          l: false,
          m: false,
        },
        {
          k: "k",
          l: false,
          m: "m",
        },
      ],
      b: "bbb1",
      c: false,
    },
    {
      a: [
        {
          k: "k",
          l: false,
          m: "m",
        },
        {
          k: "k",
          l: false,
          m: "m",
        },
      ],
      b: "bbb2",
      c: false,
    },
    { b: false },
    { c: false },
  ]),
  ["c", "a[0].l"],
);
