import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isEmpty } from "../dist/ast-is-empty.esm.js";

function dummyFunction() {
  return true;
}

// ==============================
// Tests
// ==============================

test("01 - plain object - true", () => {
  equal(
    isEmpty({
      a: "",
      b: "",
    }),
    true,
    "01.01",
  );
  equal(isEmpty({}), true, "01.02");
});

test("02 - plain object - false", () => {
  equal(
    isEmpty({
      a: "",
      b: "a",
    }),
    false,
    "02.01",
  );
});

test("03 - array - true", () => {
  equal(isEmpty(["", ""]), true, "03.01");
  equal(isEmpty([]), true, "03.02");
});

test("04 - array - false", () => {
  equal(isEmpty(["", " "]), false, "04.01");
});

test("05 - nested array - true", () => {
  equal(isEmpty(["", [""]]), true, "05.01");
});

test("06 - nested array - false", () => {
  equal(isEmpty(["", [" "]]), false, "06.01");
});

test("07 - nested plain object - true", () => {
  equal(
    isEmpty({
      a: "",
      b: { c: "" },
    }),
    true,
    "07.01",
  );
});

test("08 - nested plain object - true", () => {
  equal(
    isEmpty({
      a: "",
      b: { c: "" },
    }),
    true,
    "08.01",
  );
});

test("09 - nested many things - true", () => {
  equal(
    isEmpty([
      {
        a: [""],
        b: { c: ["", "", { d: [""] }] },
      },
    ]),
    true,
    "09.01",
  );
});

test("10 - nested many things - true", () => {
  equal(
    isEmpty([
      {
        a: [""],
        b: { c: ["", " ", { d: [""] }] },
      },
    ]),
    false,
    "10.01",
  );
});

test("11 - string - true", () => {
  equal(isEmpty(""), true, "11.01");
});

test("12 - string - false", () => {
  equal(isEmpty("."), false, "12.01");
});

// ==============================
// Retruns Null
// ==============================

test("13 - function as input - returns null", () => {
  equal(isEmpty(dummyFunction), null, "13.01");
});

test("14 - function as input - returns null", () => {
  equal(isEmpty([dummyFunction]), null, "14.01");
  equal(isEmpty({ method: dummyFunction }), null, "14.02");
});

test("15 - null - returns null", () => {
  equal(isEmpty(null), null, "15.01");
});

test.run();
