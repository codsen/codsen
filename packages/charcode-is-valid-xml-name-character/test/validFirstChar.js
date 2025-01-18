/* eslint-disable @typescript-eslint/no-unused-vars */

import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
} from "../dist/charcode-is-valid-xml-name-character.esm.js";

// -----------------------------------------------------------------------------
// validFirstChar
// -----------------------------------------------------------------------------

test("01 - validFirstChar() same as isProduction4()", () => {
  equal(validFirstChar("a"), true, "01.01");
  equal(validFirstChar("Z"), true, "01.02");
  equal(validFirstChar("?"), false, "01.03");
  equal(validFirstChar("-"), false, "01.04");
  equal(validFirstChar("1"), false, "01.05");
  equal(validFirstChar(":"), true, "01.06");
  equal(validFirstChar("_"), true, "01.07");
  equal(
    validFirstChar("\uD800\uDC00"), // #x10000
    true,
    "01.08",
  );
  equal(
    validFirstChar("\uDB7F\uDFFF"), // #xEFFFF
    true,
    "01.09",
  );
});

test.run();
