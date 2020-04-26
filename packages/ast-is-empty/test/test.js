import tap from "tap";
import isEmpty from "../dist/ast-is-empty.esm";

function dummyFunction() {
  return true;
}

// ==============================
// Tests
// ==============================

tap.test("1.1 - plain object - true", (t) => {
  t.equal(
    isEmpty({
      a: "",
      b: "",
    }),
    true,
    "1.1.1"
  );
  t.equal(isEmpty({}), true, "1.1.2");
  t.end();
});

tap.test("1.2 - plain object - false", (t) => {
  t.equal(
    isEmpty({
      a: "",
      b: "a",
    }),
    false,
    "1.2"
  );
  t.end();
});

tap.test("1.3 - array - true", (t) => {
  t.equal(isEmpty(["", ""]), true, "1.3.1");
  t.equal(isEmpty([]), true, "1.3.2");
  t.end();
});

tap.test("1.4 - array - false", (t) => {
  t.equal(isEmpty(["", " "]), false, "1.4");
  t.end();
});

tap.test("1.5 - nested array - true", (t) => {
  t.equal(isEmpty(["", [""]]), true, "1.5");
  t.end();
});

tap.test("1.6 - nested array - false", (t) => {
  t.equal(isEmpty(["", [" "]]), false, "1.6");
  t.end();
});

tap.test("1.7 - nested plain object - true", (t) => {
  t.equal(
    isEmpty({
      a: "",
      b: { c: "" },
    }),
    true,
    "1.7"
  );
  t.end();
});

tap.test("1.8 - nested plain object - true", (t) => {
  t.equal(
    isEmpty({
      a: "",
      b: { c: "" },
    }),
    true,
    "1.8"
  );
  t.end();
});

tap.test("1.9 - nested many things - true", (t) => {
  t.equal(
    isEmpty([
      {
        a: [""],
        b: { c: ["", "", { d: [""] }] },
      },
    ]),
    true,
    "1.9"
  );
  t.end();
});

tap.test("1.10 - nested many things - true", (t) => {
  t.equal(
    isEmpty([
      {
        a: [""],
        b: { c: ["", " ", { d: [""] }] },
      },
    ]),
    false,
    "1.10"
  );
  t.end();
});

tap.test("1.11 - string - true", (t) => {
  t.equal(isEmpty(""), true, "1.11");
  t.end();
});

tap.test("1.12 - string - false", (t) => {
  t.equal(isEmpty("."), false, "1.12");
  t.end();
});

// ==============================
// Retruns Null
// ==============================

tap.test("2.13 - function as input - returns null", (t) => {
  t.equal(isEmpty(dummyFunction), null, "2.13");
  t.end();
});

tap.test("2.14 - function as input - returns null", (t) => {
  t.equal(isEmpty([dummyFunction]), null, "2.14.1");
  t.equal(isEmpty({ method: dummyFunction }), null, "2.14.2");
  t.end();
});

tap.test("2.15 - null - returns null", (t) => {
  t.equal(isEmpty(null), null, "2.15");
  t.end();
});
