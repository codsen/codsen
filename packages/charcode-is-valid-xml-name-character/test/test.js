import test from "ava";
import {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards
} from "../dist/charcode-is-valid-xml-name-character.esm";

// -----------------------------------------------------------------------------
// 01. isProduction4
// -----------------------------------------------------------------------------

test("01.01 - isProduction4()", t => {
  t.is(isProduction4("a"), true, "01.01.01");
  t.is(isProduction4("Z"), true, "01.01.02");
  t.is(isProduction4("?"), false, "01.01.03");
  t.is(isProduction4("-"), false, "01.01.04");
  t.is(isProduction4("1"), false, "01.01.05");
  t.is(isProduction4(":"), true, "01.01.06");
  t.is(isProduction4("_"), true, "01.01.06");
  t.is(
    isProduction4("\uD800\uDC00"), // #x10000
    true,
    "01.01.07"
  );
  t.is(
    isProduction4("\uDB7F\uDFFF"), // #xEFFFF
    true,
    "01.01.08"
  );
});

test("01.02 - validFirstChar() same as isProduction4()", t => {
  t.is(validFirstChar("a"), true, "01.02.01");
  t.is(validFirstChar("Z"), true, "01.02.02");
  t.is(validFirstChar("?"), false, "01.02.03");
  t.is(validFirstChar("-"), false, "01.02.04");
  t.is(validFirstChar("1"), false, "01.02.05");
  t.is(validFirstChar(":"), true, "01.02.06");
  t.is(validFirstChar("_"), true, "01.02.06");
  t.is(
    validFirstChar("\uD800\uDC00"), // #x10000
    true,
    "01.02.07"
  );
  t.is(
    validFirstChar("\uDB7F\uDFFF"), // #xEFFFF
    true,
    "01.02.08"
  );
});

// -----------------------------------------------------------------------------
// 02. isProduction4a
// -----------------------------------------------------------------------------

test("02.01 - isProduction4a()", t => {
  t.is(isProduction4a("a"), true, "02.01.01");
  t.is(isProduction4a("?"), false, "02.01.02");
  t.is(isProduction4a("-"), true, "02.01.03");
  t.is(isProduction4a("1"), true, "02.01.04");
  t.is(isProduction4a(":"), true, "02.01.05");
  t.is(isProduction4a("_"), true, "02.01.06");
  t.is(
    isProduction4a("\uD800\uDC00"), // #x10000
    true,
    "02.01.07"
  );
  t.is(
    isProduction4a("\uDB7F\uDFFF"), // #xEFFFF
    true,
    "02.01.08"
  );
});

test("02.02 - validSecondCharOnwards() same as isProduction4a()", t => {
  t.is(validSecondCharOnwards("a"), true, "02.02.01");
  t.is(validSecondCharOnwards("?"), false, "02.02.02");
  t.is(validSecondCharOnwards("-"), true, "02.02.03");
  t.is(validSecondCharOnwards("1"), true, "02.02.04");
  t.is(validSecondCharOnwards(":"), true, "02.02.05");
  t.is(validSecondCharOnwards("_"), true, "02.02.06");
  t.is(
    validSecondCharOnwards("\uD800\uDC00"), // #x10000
    true,
    "02.02.07"
  );
  t.is(
    validSecondCharOnwards("\uDB7F\uDFFF"), // #xEFFFF
    true,
    "02.02.08"
  );
});
