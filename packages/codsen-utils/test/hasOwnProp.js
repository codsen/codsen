import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { hasOwnProp } from "../dist/codsen-utils.esm.js";

// ------------------------------------------------------

test("01", () => {
  equal(hasOwnProp(1, "x"), false, "01.01");
  equal(hasOwnProp("a", "x"), false, "01.02");
  equal(hasOwnProp(null, "x"), false, "01.03");
  equal(hasOwnProp(false, "x"), false, "01.04");
  equal(hasOwnProp(undefined, "x"), false, "01.05");

  equal(hasOwnProp(1, " "), false, "01.06");
  equal(hasOwnProp("a", " "), false, "01.07");
  equal(hasOwnProp(null, " "), false, "01.08");
  equal(hasOwnProp(false, " "), false, "01.09");
  equal(hasOwnProp(undefined, " "), false, "01.10");

  equal(hasOwnProp(1, ""), false, "01.11");
  equal(hasOwnProp("a", ""), false, "01.12");
  equal(hasOwnProp(null, ""), false, "01.13");
  equal(hasOwnProp(false, ""), false, "01.14");
  equal(hasOwnProp(undefined, ""), false, "01.15");
});

test("02", () => {
  equal(hasOwnProp({ a: "x" }, "a"), true, "02.01");
  equal(hasOwnProp({ a: "x" }, "b"), false, "02.02");
});

test("03", () => {
  equal(hasOwnProp({ a: "x" }, " a"), false, "03.01");
  equal(hasOwnProp({ a: "x" }, " b"), false, "03.02");
});

test("04", () => {
  equal(hasOwnProp({ a: "x" }, ""), false, "04.01");
  equal(hasOwnProp({ a: "x" }, " "), false, "04.02");
  equal(hasOwnProp({ a: "x" }, "\n"), false, "04.03");
});

test.run();
