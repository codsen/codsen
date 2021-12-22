import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

test("01 - Russian/Lithuanian/continental decimal notation style CSV that uses commas", () => {
  equal(
    splitEasy(
      'Product Name,Main Price (EUR),Discounted Price (EUR)\n\rCepelinai,"5,25","5,1"\nJautienos kepsnys,"14,5","14,2"'
    ),
    [
      ["Product Name", "Main Price (EUR)", "Discounted Price (EUR)"],
      ["Cepelinai", "5,25", "5,10"],
      ["Jautienos kepsnys", "14,50", "14,20"],
    ],
    "01.01 - does not convert the notation by default, but does pad"
  );
  equal(
    splitEasy(
      'Product Name,Main Price (EUR),Discounted Price (EUR)\n\rCepelinai,"5,25","5,1"\nJautienos kepsnys,"14,5","14,2"',
      { forceUKStyle: true }
    ),
    [
      ["Product Name", "Main Price (EUR)", "Discounted Price (EUR)"],
      ["Cepelinai", "5.25", "5.10"],
      ["Jautienos kepsnys", "14.50", "14.20"],
    ],
    "01.02 - converts the notation as requested, and does pad by default"
  );
  equal(
    splitEasy(
      'Product Name,Main Price (EUR),Discounted Price (EUR)\n\rCepelinai,"5,25","5,1"\nJautienos kepsnys,"14,5","14,2"',
      { padSingleDecimalPlaceNumbers: false }
    ),
    [
      ["Product Name", "Main Price (EUR)", "Discounted Price (EUR)"],
      ["Cepelinai", "5,25", "5,1"],
      ["Jautienos kepsnys", "14,5", "14,2"],
    ],
    "01.03 - does not convert the notation by default, and does not pad as requested"
  );
  equal(
    splitEasy(
      'Product Name,Main Price (EUR),Discounted Price (EUR)\n\rCepelinai,"5,25","5,1"\nJautienos kepsnys,"14,5","14,2"',
      { forceUKStyle: true, padSingleDecimalPlaceNumbers: false }
    ),
    [
      ["Product Name", "Main Price (EUR)", "Discounted Price (EUR)"],
      ["Cepelinai", "5.25", "5.1"],
      ["Jautienos kepsnys", "14.5", "14.2"],
    ],
    "01.04 - converts the notation as requested, but does not pad as requested"
  );
});

test.run();
