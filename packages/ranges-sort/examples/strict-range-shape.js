// Require two-element ranges

import { strict as assert } from "node:assert";

import { rSort } from "../dist/ranges-sort.esm.js";

assert.throws(
  () =>
    rSort([[1, 2, "replacement"]], {
      strictlyTwoElementsInRangeArrays: true,
    }),
  /THROW_ID_01/,
);
