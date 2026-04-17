// Synchronous `getKeysetSync()`

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
  sortAllObjectsSync({
    a: "a",
    c: "c",
    b: "b",
  }),
  {
    a: "a",
    b: "b",
    c: "c",
  },
);
