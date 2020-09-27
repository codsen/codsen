/* eslint import/extensions:0, no-unused-vars:0 */

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

const schema = getKeysetSync([
  {
    // <- object #1
    a: "a",
    b: "c",
    c: {
      d: "d",
      e: "e",
    },
  },
  {
    // <- object #2
    a: "a",
  },
  {
    // <- object #3
    c: {
      f: "f",
    },
  },
]);

assert.deepEqual(schema, {
  a: false,
  b: false,
  c: {
    d: false,
    e: false,
    f: false,
  },
});
