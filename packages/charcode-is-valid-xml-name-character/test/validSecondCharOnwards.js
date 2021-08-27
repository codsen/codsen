/* eslint no-unused-vars:0 */

import tap from "tap";
import {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
} from "../dist/charcode-is-valid-xml-name-character.esm.js";

// -----------------------------------------------------------------------------
// validSecondCharOnwards
// -----------------------------------------------------------------------------

tap.test("01 - validSecondCharOnwards() same as isProduction4a()", (t) => {
  t.equal(validSecondCharOnwards("a"), true, "01.01");
  t.equal(validSecondCharOnwards("?"), false, "01.02");
  t.equal(validSecondCharOnwards("-"), true, "01.03");
  t.equal(validSecondCharOnwards("1"), true, "01.04");
  t.equal(validSecondCharOnwards(":"), true, "01.05");
  t.equal(validSecondCharOnwards("_"), true, "01.06");
  t.equal(
    validSecondCharOnwards("\uD800\uDC00"), // #x10000
    true,
    "01.07"
  );
  t.equal(
    validSecondCharOnwards("\uDB7F\uDFFF"), // #xEFFFF
    true,
    "01.08"
  );
  t.end();
});
