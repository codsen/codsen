import { strict as assert } from "node:assert";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

assert.deepEqual(
  splitEasy("item,price\nWidget,1.5", {
    padSingleDecimalPlaceNumbers: false,
  }),
  [
    ["item", "price"],
    ["Widget", "1.5"],
  ],
);
