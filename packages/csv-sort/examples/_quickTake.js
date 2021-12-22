// Quick Take

import { strict as assert } from "assert";

import { sort } from "../dist/csv-sort.esm.js";

// Sorts double-entry bookkeeping CSV's - bank statements for example
// see https://en.wikipedia.org/wiki/Double-entry_bookkeeping

assert.deepEqual(
  sort(`Acc Number,Description,Debit Amount,Credit Amount,Balance,
123456,Client #1 payment,,1000,1940
123456,Bought carpet,30,,950
123456,Bought table,10,,940
123456,Bought pens,10,,1000
123456,Bought chairs,20,,980
`),
  {
    res: [
      ["Acc Number", "Description", "Debit Amount", "Credit Amount", "Balance"],
      ["123456", "Client #1 payment", "", "1000", "1940"],
      ["123456", "Bought table", "10", "", "940"],
      ["123456", "Bought carpet", "30", "", "950"],
      ["123456", "Bought chairs", "20", "", "980"],
      ["123456", "Bought pens", "10", "", "1000"],
    ],
    msgContent: null,
    msgType: null,
  }
);
// you'll have to join elements and lines from the array yourself
