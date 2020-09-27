/* eslint no-unused-vars:0 */

import tap from "tap";
import {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
} from "../dist/charcode-is-valid-xml-name-character.esm";

// -----------------------------------------------------------------------------
// isProduction4a
// -----------------------------------------------------------------------------

tap.test("01 - isProduction4a()", (t) => {
  t.equal(isProduction4a("a"), true, "01.01");
  t.equal(isProduction4a("?"), false, "01.02");
  t.equal(isProduction4a("-"), true, "01.03");
  t.equal(isProduction4a("1"), true, "01.04");
  t.equal(isProduction4a(":"), true, "01.05");
  t.equal(isProduction4a("_"), true, "01.06");
  t.equal(
    isProduction4a("\uD800\uDC00"), // #x10000
    true,
    "01.07"
  );
  t.equal(
    isProduction4a("\uDB7F\uDFFF"), // #xEFFFF
    true,
    "01.08"
  );
  t.end();
});
