// Synchronous `findUnusedSync()` - example #1

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
