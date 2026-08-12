import { strict as assert } from "node:assert";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

assert.deepEqual(
  splitEasy('item;price\nWidget;"1.234,5"', {
    delimiter: ";",
    forceUKStyle: true,
  }),
  [
    ["item", "price"],
    ["Widget", "1234.50"],
  ],
);
