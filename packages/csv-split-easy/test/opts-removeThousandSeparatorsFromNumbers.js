import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

test("01 - deals with (or does not) thousand separators in numbers", () => {
  equal(
    splitEasy(
      'Product Name,Main Price,Discounted Price\nTestarossa (Type F110),"100,000","90,000"\nF50,"2,500,000","1,800,000"',
    ),
    [
      ["Product Name", "Main Price", "Discounted Price"],
      ["Testarossa (Type F110)", "100000", "90000"],
      ["F50", "2500000", "1800000"],
    ],
    "01.01",
  );
  equal(
    splitEasy(
      'Product Name,Main Price,Discounted Price\nTestarossa (Type F110),"100,000","90,000"\nF50,"2,500,000","1,800,000"',
      { removeThousandSeparatorsFromNumbers: false },
    ),
    [
      ["Product Name", "Main Price", "Discounted Price"],
      ["Testarossa (Type F110)", "100,000", "90,000"],
      ["F50", "2,500,000", "1,800,000"],
    ],
    "01.02",
  );
});

test.run();
