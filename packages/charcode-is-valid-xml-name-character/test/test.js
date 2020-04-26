import tap from "tap";
import {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
} from "../dist/charcode-is-valid-xml-name-character.esm";

// -----------------------------------------------------------------------------
// 01. isProduction4
// -----------------------------------------------------------------------------

tap.test("01.01 - isProduction4()", (t) => {
  t.equal(isProduction4("a"), true, "01.01.01");
  t.equal(isProduction4("Z"), true, "01.01.02");
  t.equal(isProduction4("?"), false, "01.01.03");
  t.equal(isProduction4("-"), false, "01.01.04");
  t.equal(isProduction4("1"), false, "01.01.05");
  t.equal(isProduction4(":"), true, "01.01.06");
  t.equal(isProduction4("_"), true, "01.01.06");
  t.equal(
    isProduction4("\uD800\uDC00"), // #x10000
    true,
    "01.01.07"
  );
  t.equal(
    isProduction4("\uDB7F\uDFFF"), // #xEFFFF
    true,
    "01.01.08"
  );
  t.end();
});

tap.test("01.02 - validFirstChar() same as isProduction4()", (t) => {
  t.equal(validFirstChar("a"), true, "01.02.01");
  t.equal(validFirstChar("Z"), true, "01.02.02");
  t.equal(validFirstChar("?"), false, "01.02.03");
  t.equal(validFirstChar("-"), false, "01.02.04");
  t.equal(validFirstChar("1"), false, "01.02.05");
  t.equal(validFirstChar(":"), true, "01.02.06");
  t.equal(validFirstChar("_"), true, "01.02.06");
  t.equal(
    validFirstChar("\uD800\uDC00"), // #x10000
    true,
    "01.02.07"
  );
  t.equal(
    validFirstChar("\uDB7F\uDFFF"), // #xEFFFF
    true,
    "01.02.08"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// 02. isProduction4a
// -----------------------------------------------------------------------------

tap.test("02.01 - isProduction4a()", (t) => {
  t.equal(isProduction4a("a"), true, "02.01.01");
  t.equal(isProduction4a("?"), false, "02.01.02");
  t.equal(isProduction4a("-"), true, "02.01.03");
  t.equal(isProduction4a("1"), true, "02.01.04");
  t.equal(isProduction4a(":"), true, "02.01.05");
  t.equal(isProduction4a("_"), true, "02.01.06");
  t.equal(
    isProduction4a("\uD800\uDC00"), // #x10000
    true,
    "02.01.07"
  );
  t.equal(
    isProduction4a("\uDB7F\uDFFF"), // #xEFFFF
    true,
    "02.01.08"
  );
  t.end();
});

tap.test("02.02 - validSecondCharOnwards() same as isProduction4a()", (t) => {
  t.equal(validSecondCharOnwards("a"), true, "02.02.01");
  t.equal(validSecondCharOnwards("?"), false, "02.02.02");
  t.equal(validSecondCharOnwards("-"), true, "02.02.03");
  t.equal(validSecondCharOnwards("1"), true, "02.02.04");
  t.equal(validSecondCharOnwards(":"), true, "02.02.05");
  t.equal(validSecondCharOnwards("_"), true, "02.02.06");
  t.equal(
    validSecondCharOnwards("\uD800\uDC00"), // #x10000
    true,
    "02.02.07"
  );
  t.equal(
    validSecondCharOnwards("\uDB7F\uDFFF"), // #xEFFFF
    true,
    "02.02.08"
  );
  t.end();
});
