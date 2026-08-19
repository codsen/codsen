// Keep the thousand separators in numbers

import { strict as assert } from "node:assert";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

assert.deepEqual(
  splitEasy('item,price\nWidget,"1,250"', {
    removeThousandSeparatorsFromNumbers: false,
  }),
  [
    ["item", "price"],
    ["Widget", "1,250"],
  ],
);
