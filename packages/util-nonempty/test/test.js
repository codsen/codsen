import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { nonEmpty } from "../dist/util-nonempty.esm.js";

// ==============================
// Precautions
// ==============================

test("01 - inputs missing - returns false", () => {
  equal(nonEmpty(), false, "01.01");
});

// ==============================
// Normal use
// ==============================

test("02 - Array", () => {
  equal(nonEmpty(["a"]), true, "02.01");
  equal(nonEmpty([]), false, "02.02");
});

test("03 - Plain object", () => {
  equal(nonEmpty({ a: "a" }), true, "03.01");
  equal(nonEmpty({}), false, "03.02");
});

test("04 - String", () => {
  equal(nonEmpty("a"), true, "04.01");
  equal(nonEmpty(""), false, "04.02");
});

test("05 - null", () => {
  equal(nonEmpty(null), false, "05.01");
});

test('06 - hardcoded "undefined" - same as missing input', () => {
  equal(nonEmpty(undefined), false, "06.01");
});

test("07 - boolean - still empty (!)", () => {
  equal(nonEmpty(true), false, "07.01");
  equal(nonEmpty(false), false, "07.02");
});

test("08 - function - still empty, no matter what's returned (!)", () => {
  function dummy() {
    return "a";
  }
  equal(nonEmpty(dummy), false, "08.01");
});

test("09 - Number", () => {
  equal(nonEmpty(10), true, "09.01");
  equal(nonEmpty(0), true, "09.02");
});

test.run();
