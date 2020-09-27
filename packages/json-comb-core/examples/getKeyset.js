/* eslint import/extensions:0, no-unused-vars:0 */

// Asynchronous `getKeyset()`

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

// Let's calculate the schema of the following arrays of plain objects,
// and do it asynchronously.

// Let's use an async IIFE to trigger the action and let us use await:
(async () => {
  // First, prepare array of promises:
  const source = [
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
