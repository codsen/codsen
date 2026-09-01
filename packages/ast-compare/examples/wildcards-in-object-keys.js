// Match object keys using wildcards

import { strict as assert } from "node:assert";

import { compare } from "../dist/ast-compare.esm.js";

// A wildcard property matches one key and recursively compares its value.
assert.equal(
  compare(
    { dataPrimary: 1, dataSecondary: 2, title: "Example" },
    { "data*": 1 },
    { useWildcards: true },
  ),
  true,
);
