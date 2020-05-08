import tap from "tap";
import isEmpty from "../dist/ast-is-empty.esm";

function dummyFunction() {
  return true;
}

// ==============================
// Tests
// ==============================

tap.test("01 - plain object - true", (t) => {
  t.equal(
    isEmpty({
      a: "",
      b: "",
    }),
    true,
    "01.01"
  );
  t.equal(isEmpty({}), true, "01.02");
  t.end();
});

tap.test("02 - plain object - false", (t) => {
  t.equal(
    isEmpty({
      a: "",
      b: "a",
    }),
    false,
    "02"
  );
  t.end();
});

tap.test("03 - array - true", (t) => {
  t.equal(isEmpty(["", ""]), true, "03.01");
  t.equal(isEmpty([]), true, "03.02");
  t.end();
});

tap.test("04 - array - false", (t) => {
  t.equal(isEmpty(["", " "]), false, "04");
  t.end();
});

tap.test("05 - nested array - true", (t) => {
  t.equal(isEmpty(["", [""]]), true, "05");
  t.end();
});

tap.test("06 - nested array - false", (t) => {
  t.equal(isEmpty(["", [" "]]), false, "06");
  t.end();
});

tap.test("07 - nested plain object - true", (t) => {
  t.equal(
    isEmpty({
      a: "",
      b: { c: "" },
    }),
    true,
    "07"
  );
  t.end();
});

tap.test("08 - nested plain object - true", (t) => {
  t.equal(
    isEmpty({
      a: "",
      b: { c: "" },
    }),
    true,
    "08"
  );
  t.end();
});

tap.test("09 - nested many things - true", (t) => {
  t.equal(
    isEmpty([
      {
        a: [""],
        b: { c: ["", "", { d: [""] }] },
      },
    ]),
    true,
    "09"
  );
  t.end();
});

tap.test("10 - nested many things - true", (t) => {
  t.equal(
    isEmpty([
      {
        a: [""],
        b: { c: ["", " ", { d: [""] }] },
      },
    ]),
    false,
    "10"
  );
  t.end();
});

tap.test("11 - string - true", (t) => {
  t.equal(isEmpty(""), true, "11");
  t.end();
});

tap.test("12 - string - false", (t) => {
  t.equal(isEmpty("."), false, "12");
  t.end();
});

// ==============================
// Retruns Null
// ==============================

tap.test("13 - function as input - returns null", (t) => {
  t.equal(isEmpty(dummyFunction), null, "13");
  t.end();
});

tap.test("14 - function as input - returns null", (t) => {
  t.equal(isEmpty([dummyFunction]), null, "14.01");
  t.equal(isEmpty({ method: dummyFunction }), null, "14.02");
  t.end();
});

tap.test("15 - null - returns null", (t) => {
  t.equal(isEmpty(null), null, "15");
  t.end();
});
