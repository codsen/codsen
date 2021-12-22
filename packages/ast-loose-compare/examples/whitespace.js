// Empty Values

import { strict as assert } from "assert";

import { looseCompare } from "../dist/ast-loose-compare.esm.js";

// both values are empty - they trim() to zero-length
assert.equal(
  looseCompare(
    {
      a: "a",
      b: "\n \n\n",
    },
    {
      a: "a",
      b: "\t\t \t",
    }
  ),
  true
);
