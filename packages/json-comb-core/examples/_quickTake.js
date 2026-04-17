// Quick Take

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

// STEP #1
// =======

// calculate the schema - superset of all possible keys used across
// all JSON files
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

// STEP #2
// =======

// now we can normalise the object #2 for example:
assert.deepEqual(
  enforceKeysetSync(
    {
      // <- object #2
      a: "a",
    },
    schema,
  ),
  {
    a: "a",
    b: false,
    c: {
      d: false,
      e: false,
      f: false,
    },
  },
);
