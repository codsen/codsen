// Synchronous `findUnusedSync()` - example #1

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

assert.deepEqual(
  findUnusedSync([
    {
      // <- object #1
      a: false,
      b: "bbb1",
      c: false,
    },
    {
      // <- object #2
      a: "aaa",
      b: "bbb2",
      c: false,
    },
    {}, // <- object #3
  ]),
  ["c"],
);
