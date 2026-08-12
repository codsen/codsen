// Sort a bank statement that has no header row

import { strict as assert } from "node:assert";

import { sort } from "../dist/csv-sort.esm.js";

assert.deepEqual(
  sort(`123456,Payment,,1000,1940
123456,Carpet,30,,950
123456,Table,10,,940
123456,Pens,10,,1000
123456,Chairs,20,,980`),
  {
    res: [
      ["123456", "Payment", "", "1000", "1940"],
      ["123456", "Table", "10", "", "940"],
      ["123456", "Carpet", "30", "", "950"],
      ["123456", "Chairs", "20", "", "980"],
      ["123456", "Pens", "10", "", "1000"],
    ],
    msgContent: null,
    msgType: null,
  },
);
