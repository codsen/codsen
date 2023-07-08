/* eslint-disable no-unused-vars */
// Synchronous `getKeysetSync()`

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
