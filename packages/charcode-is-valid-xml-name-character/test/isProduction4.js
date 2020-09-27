/* eslint no-unused-vars:0 */

import tap from "tap";
import {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
} from "../dist/charcode-is-valid-xml-name-character.esm";

// -----------------------------------------------------------------------------
// isProduction4
// -----------------------------------------------------------------------------

tap.test("01 - isProduction4()", (t) => {
  t.equal(isProduction4("a"), true, "01.01");
  t.equal(isProduction4("Z"), true, "01.02");
  t.equal(isProduction4("?"), false, "01.03");
  t.equal(isProduction4("-"), false, "01.04");
  t.equal(isProduction4("1"), false, "01.05");
  t.equal(isProduction4(":"), true, "01.06");
  t.equal(isProduction4("_"), true, "01.07");
  t.equal(
    isProduction4("\uD800\uDC00"), // #x10000
    true,
    "01.08"
  );
  t.equal(
    isProduction4("\uDB7F\uDFFF"), // #xEFFFF
    true,
    "01.09"
  );
  t.end();
});
