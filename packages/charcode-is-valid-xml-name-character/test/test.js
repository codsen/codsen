import test from "ava";
import {
  isProduction4,
  isProduction4a
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
