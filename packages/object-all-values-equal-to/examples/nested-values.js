// Check the values in nested objects and arrays

import { strict as assert } from "node:assert";

import { allEq } from "../dist/object-all-values-equal-to.esm.js";

assert.equal(
  allEq(
    {
      a: {
        b: false,
        c: [{ d: false, e: false }, { g: false }],
      },
      c: false,
    },
    false,
  ),
  true,
);
