import tap from "tap";
import { nonEmpty } from "../dist/util-nonempty.esm";

// ==============================
// Precautions
// ==============================

tap.test("01 - inputs missing - returns false", (t) => {
  t.equal(nonEmpty(), false, "01");
  t.end();
});

// ==============================
// Normal use
// ==============================

tap.test("02 - Array", (t) => {
  t.equal(nonEmpty(["a"]), true, "02.01");
  t.equal(nonEmpty([]), false, "02.02");
  t.end();
});

tap.test("03 - Plain object", (t) => {
  t.equal(nonEmpty({ a: "a" }), true, "03.01");
  t.equal(nonEmpty({}), false, "03.02");
  t.end();
});

tap.test("04 - String", (t) => {
  t.equal(nonEmpty("a"), true, "04.01");
  t.equal(nonEmpty(""), false, "04.02");
  t.end();
});

tap.test("05 - null", (t) => {
  t.equal(nonEmpty(null), false, "05");
  t.end();
});

tap.test('06 - hardcoded "undefined" - same as missing input', (t) => {
  t.equal(nonEmpty(undefined), false, "06");
  t.end();
});

tap.test("07 - boolean - still empty (!)", (t) => {
  t.equal(nonEmpty(true), false, "07.01");
  t.equal(nonEmpty(false), false, "07.02");
  t.end();
});

tap.test("08 - function - still empty, no matter what's returned (!)", (t) => {
  const f = function dummy() {
    return "a";
  };
  t.equal(nonEmpty(f), false, "08");
  t.end();
});

tap.test("09 - Number", (t) => {
  t.equal(nonEmpty(10), true, "09.01");
  t.equal(nonEmpty(0), true, "09.02");
  t.end();
});
