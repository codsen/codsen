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
} from "../dist/json-comb-core.esm";

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
  }
);
