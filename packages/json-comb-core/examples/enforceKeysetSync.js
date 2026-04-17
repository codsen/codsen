// Synchronous `enforceKeysetSync()`

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

const schema = {
  a: false,
  b: false,
  c: {
    d: false,
    e: false,
    f: false,
  },
};

assert.deepEqual(
  enforceKeysetSync(
    {
      c: { d: "x" },
    },
    schema,
  ),
  {
    a: false,
    b: false,
    c: {
      d: "x",
      e: false,
      f: false,
    },
  },
);
