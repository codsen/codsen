// Asynchronous `getKeyset()`

import { strict as assert } from "node:assert";

import { getKeyset } from "../dist/json-comb-core.esm.js";

// Let's calculate the schema of the following arrays of plain objects,
// and do it asynchronously.

// Await each operation before checking its result.
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
