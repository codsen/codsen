/* eslint no-unused-vars:0 */

import tap from "tap";
import {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
} from "../dist/charcode-is-valid-xml-name-character.esm";

// -----------------------------------------------------------------------------
// validFirstChar
// -----------------------------------------------------------------------------

tap.test("01 - validFirstChar() same as isProduction4()", (t) => {
  t.equal(validFirstChar("a"), true, "01.01");
  t.equal(validFirstChar("Z"), true, "01.02");
  t.equal(validFirstChar("?"), false, "01.03");
  t.equal(validFirstChar("-"), false, "01.04");
  t.equal(validFirstChar("1"), false, "01.05");
  t.equal(validFirstChar(":"), true, "01.06");
  t.equal(validFirstChar("_"), true, "01.07");
  t.equal(
    validFirstChar("\uD800\uDC00"), // #x10000
    true,
    "01.08"
  );
  t.equal(
    validFirstChar("\uDB7F\uDFFF"), // #xEFFFF
    true,
    "01.09"
  );
  t.end();
});
