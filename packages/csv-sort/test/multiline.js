import { test } from "uvu";
import { equal } from "uvu/assert";

import { sort } from "../dist/csv-sort.esm.js";

test("01 - a quoted LF description remains one field among all five transactions", () => {
  equal(
    sort(`Acc Number,Description,Debit Amount,Credit Amount,Balance,
123456,Client #1 payment,,1000,1940
123456,"Bought
carpet",30,,950
123456,Bought table,10,,940
123456,Bought pens,10,,1000
123456,Bought chairs,20,,980
`),
    {
      res: [
        [
          "Acc Number",
          "Description",
          "Debit Amount",
          "Credit Amount",
          "Balance",
        ],
        ["123456", "Client #1 payment", "", "1000", "1940"],
        ["123456", "Bought table", "10", "", "940"],
        ["123456", "Bought\ncarpet", "30", "", "950"],
        ["123456", "Bought chairs", "20", "", "980"],
        ["123456", "Bought pens", "10", "", "1000"],
      ],
      msgContent: null,
      msgType: null,
    },
    "01.01",
  );
});

test("02 - quoted CRLF and CR descriptions preserve their bytes with LF records", () => {
  for (const lineBreak of ["\r\n", "\r"]) {
    equal(
      sort(`Acc Number,Description,Debit Amount,Credit Amount,Balance,
123456,Client #1 payment,,1000,1940
123456,"Bought${lineBreak}carpet",30,,950
123456,Bought table,10,,940
123456,Bought pens,10,,1000
123456,Bought chairs,20,,980
`),
      {
        res: [
          [
            "Acc Number",
            "Description",
            "Debit Amount",
            "Credit Amount",
            "Balance",
          ],
          ["123456", "Client #1 payment", "", "1000", "1940"],
          ["123456", "Bought table", "10", "", "940"],
          ["123456", `Bought${lineBreak}carpet`, "30", "", "950"],
          ["123456", "Bought chairs", "20", "", "980"],
          ["123456", "Bought pens", "10", "", "1000"],
        ],
        msgContent: null,
        msgType: null,
      },
      `02.01 - ${JSON.stringify(lineBreak)}`,
    );
  }
});

test.run();
