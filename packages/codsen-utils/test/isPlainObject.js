import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isPlainObject } from "../dist/codsen-utils.esm.js";

// ------------------------------------------------------

test("01 - plain object, no keys", () => {
  equal(isPlainObject({}), true, "01.01");
});

test("02 - plain object with keys", () => {
  equal(
    isPlainObject({
      a: 1,
    }),
    true,
    "02.01",
  );
});

test("03 - new Object", () => {
  equal(isPlainObject(new Object()), true, "03.01");
});

test("04 - container object", () => {
  equal(isPlainObject(Object.create(null)), true, "04.01");
});

test("05 - array", () => {
  equal(isPlainObject([]), false, "05.01");
  equal(isPlainObject(["a"]), false, "05.02");
  equal(isPlainObject([1]), false, "05.03");
});

test("06 - function", () => {
  equal(
    isPlainObject(() => {}),
    false,
    "06.01",
  );
});

test("07 - built-ins", () => {
  equal(isPlainObject(Number), false, "07.01");
});

test("08 - class", () => {
  class Testing {}
  equal(isPlainObject(new Testing()), false, "08.01");
});

test("09 - constructor", () => {
  function Foo() {
    this.zzz = "foo";
  }
  equal(isPlainObject(new Foo()), false, "09.01");
});

test("10 - various", () => {
  // String
  equal(isPlainObject(""), false, "10.01");
  equal(isPlainObject("a"), false, "10.02");
  // Number
  equal(isPlainObject(-0), false, "10.03");
  equal(isPlainObject(0), false, "10.04");
  equal(isPlainObject(undefined), false, "10.05");
  // BigInt
  equal(isPlainObject(0n), false, "10.06");
  equal(isPlainObject(12n), false, "10.07");
  // Boolean
  equal(isPlainObject(true), false, "10.08");
  equal(isPlainObject(false), false, "10.09");
  // Undefined
  equal(isPlainObject(undefined), false, "10.10");
  // Symbol
  equal(isPlainObject(Symbol("foo")), false, "10.11");
  // Null
  equal(isPlainObject(null), false, "10.12");
});

test.run();
