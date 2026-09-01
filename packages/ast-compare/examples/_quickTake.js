// Quick Take

import { strict as assert } from "node:assert";

import { compare } from "../dist/ast-compare.esm.js";

// Check whether the second nested value is equal to, or a subset of, the first.
assert.equal(
  compare(
    {
      a: {
        b: "d",
        c: [],
        e: "f",
        g: "h",
      },
    },
    {
      a: {
        b: "d",
        c: [],
      },
    },
  ),
  true,
);
