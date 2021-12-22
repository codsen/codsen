/* eslint no-unused-vars:0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
} from "../dist/charcode-is-valid-xml-name-character.esm.js";

// -----------------------------------------------------------------------------
// validSecondCharOnwards
// -----------------------------------------------------------------------------

test("01 - validSecondCharOnwards() same as isProduction4a()", () => {
  equal(validSecondCharOnwards("a"), true, "01.01");
  equal(validSecondCharOnwards("?"), false, "01.02");
  equal(validSecondCharOnwards("-"), true, "01.03");
  equal(validSecondCharOnwards("1"), true, "01.04");
  equal(validSecondCharOnwards(":"), true, "01.05");
  equal(validSecondCharOnwards("_"), true, "01.06");
  equal(
    validSecondCharOnwards("\uD800\uDC00"), // #x10000
    true,
    "01.07"
  );
  equal(
    validSecondCharOnwards("\uDB7F\uDFFF"), // #xEFFFF
    true,
    "01.08"
  );
});

test.run();
