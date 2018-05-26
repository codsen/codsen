import test from "ava";
import isEmpty from "../dist/ast-is-empty.esm";

function dummyFunction() {
  return true;
}

// ==============================
// Tests
// ==============================

test("1.1 - plain object - true", t => {
  t.is(
    isEmpty({
      a: "",
      b: ""
    }),
    true,
    "1.1.1"
  );
  t.is(isEmpty({}), true, "1.1.2");
});

test("1.2 - plain object - false", t => {
  t.is(
    isEmpty({
      a: "",
      b: "a"
    }),
    false,
    "1.2"
  );
});

test("1.3 - array - true", t => {
  t.is(isEmpty(["", ""]), true, "1.3.1");
  t.is(isEmpty([]), true, "1.3.2");
});

test("1.4 - array - false", t => {
  t.is(isEmpty(["", " "]), false, "1.4");
});

test("1.5 - nested array - true", t => {
  t.is(isEmpty(["", [""]]), true, "1.5");
});

test("1.6 - nested array - false", t => {
  t.is(isEmpty(["", [" "]]), false, "1.6");
});

test("1.7 - nested plain object - true", t => {
  t.is(
    isEmpty({
      a: "",
      b: { c: "" }
    }),
    true,
    "1.7"
  );
});

test("1.8 - nested plain object - true", t => {
  t.is(
    isEmpty({
      a: "",
      b: { c: "" }
    }),
    true,
    "1.8"
  );
});

test("1.9 - nested many things - true", t => {
  t.is(
    isEmpty([
      {
        a: [""],
        b: { c: ["", "", { d: [""] }] }
      }
    ]),
    true,
    "1.9"
  );
});

test("1.10 - nested many things - true", t => {
  t.is(
    isEmpty([
      {
        a: [""],
        b: { c: ["", " ", { d: [""] }] }
      }
    ]),
    false,
    "1.10"
  );
});

test("1.11 - string - true", t => {
  t.is(isEmpty(""), true, "1.11");
});

test("1.12 - string - false", t => {
  t.is(isEmpty("."), false, "1.12");
});

// ==============================
// Retruns Null
// ==============================

test("2.13 - function as input - returns null", t => {
  t.is(isEmpty(dummyFunction), null, "2.13");
});

test("2.14 - function as input - returns null", t => {
  t.is(isEmpty([dummyFunction]), null, "2.14.1");
  t.is(isEmpty({ method: dummyFunction }), null, "2.14.2");
});

test("2.15 - null - returns null", t => {
  t.is(isEmpty(null), null, "2.15");
});
