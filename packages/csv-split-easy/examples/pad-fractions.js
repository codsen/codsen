// Pad single-digit fractions without changing longer decimal values

import { strict as assert } from "node:assert";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

assert.deepEqual(
  splitEasy('item;"0.5";".5";"0,5";"0.075"', {
    delimiter: ";",
    forceUKStyle: true,
  }),
  [["item", "0.50", ".50", "0.50", "0.075"]],
);
