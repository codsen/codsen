// Asynchronous `getKeyset()`

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

// Let's calculate the schema of the following arrays of plain objects,
// and do it asynchronously.

// Let's use an async IIFE to trigger the action and let us use await:
(async () => {
  // First, prepare array of promises:
  let source = [
    {
      a: "a",
      b: "c",
      c: {
        d: "d",
        e: "e",
      },
    },
    {
      a: "a",
    },
    {
      c: {
        f: "f",
      },
    },
  ].map((el) => Promise.resolve(el));

  // use async/await to avoid using .then
  assert.deepEqual(await getKeyset(source), {
    a: false,
    b: false,
    c: {
      d: false,
      e: false,
      f: false,
    },
  });
})();
