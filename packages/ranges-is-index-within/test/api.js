import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isIndexWithin } from "../dist/ranges-is-index-within.esm.js";

test("01 - 1st argument missing", () => {
  throws(
    () => {
      isIndexWithin();
    },
    /THROW_ID_01/,
    "01.01",
  );
});

test("02 - 1st and 2nd args swapped", () => {
  throws(
    () => {
      isIndexWithin([[1, 2]], 2);
    },
    /THROW_ID_01/,
    "02.01",
  );
});

test.run();
