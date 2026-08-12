// Require two-element ranges

import { strict as assert } from "node:assert";

import { rInvert } from "../dist/ranges-invert.esm.js";

assert.throws(
  () =>
    rInvert([[1, 3, "replacement"]], 5, {
      strictlyTwoElementsInRangeArrays: true,
    }),
  /THROW_ID_04/,
);
