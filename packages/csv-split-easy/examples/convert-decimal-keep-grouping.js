// Convert decimal commas while retaining grouping separators

import { strict as assert } from "node:assert";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

assert.deepEqual(
  splitEasy('item;"1 234,50"', {
    delimiter: ";",
    removeThousandSeparatorsFromNumbers: false,
    forceUKStyle: true,
  }),
  [["item", "1 234.50"]],
);
