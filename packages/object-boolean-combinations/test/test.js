import tap from "tap";
import objectBooleanCombinations from "../dist/object-boolean-combinations.esm";

// ==============================
// Basic, no overrides
// ==============================

tap.test("01 - one property - 1, no override", (t) => {
  t.strictSame(
    objectBooleanCombinations({
      a: 1,
    }),
    [{ a: 0 }, { a: 1 }],
    "01"
  );
  t.end();
});

tap.test("02 - one property - 0, no override", (t) => {
  t.strictSame(
    objectBooleanCombinations({
      a: 0,
    }),
    [{ a: 0 }, { a: 1 }],
    "02"
  );
  t.end();
});

tap.test("03 - three properties, no override", (t) => {
  t.strictSame(
    objectBooleanCombinations({
      a: 1,
      b: 1,
      c: 1,
    }),
    [
      { a: 0, b: 0, c: 0 },
      { a: 1, b: 0, c: 0 },
      { a: 0, b: 1, c: 0 },
      { a: 1, b: 1, c: 0 },
      { a: 0, b: 0, c: 1 },
      { a: 1, b: 0, c: 1 },
      { a: 0, b: 1, c: 1 },
      { a: 1, b: 1, c: 1 },
    ],
    "03"
  );
  t.end();
});

// ==============================
// Overrides or slicing
// ==============================

tap.test("04 - three properties 2 overrides", (t) => {
  t.strictSame(
    objectBooleanCombinations({ a: 0, b: 0, c: 0 }, { a: 1, b: 1 }),
    [
      { a: 1, b: 1, c: 0 },
      { a: 1, b: 1, c: 1 },
    ],
    "04.01"
  );
  t.strictSame(
    objectBooleanCombinations({ a: 0, b: 0, c: 0 }, { a: "z", b: "y" }),
    [
      { a: "z", b: "y", c: 0 },
      { a: "z", b: "y", c: 1 },
    ],
    "04.02 - override key values are strings"
  );
  t.end();
});

tap.test("05 - four properties three overrides", (t) => {
  t.strictSame(
    objectBooleanCombinations(
      {
        a: 1,
        b: 0,
        c: 0,
        d: 0,
      },
      { a: 1, b: 1, c: 1 }
    ),
    [
      {
        d: 0,
        a: 1,
        b: 1,
        c: 1,
      },
      {
        d: 1,
        a: 1,
        b: 1,
        c: 1,
      },
    ],
    "05"
  );
  t.end();
});

// edge cases:

tap.test("06 - empty override object", (t) => {
  t.strictSame(
    objectBooleanCombinations({ a: 1, b: 0, c: 0 }, {}),
    [
      { a: 0, b: 0, c: 0 },
      { a: 1, b: 0, c: 0 },
      { a: 0, b: 1, c: 0 },
      { a: 1, b: 1, c: 0 },
      { a: 0, b: 0, c: 1 },
      { a: 1, b: 0, c: 1 },
      { a: 0, b: 1, c: 1 },
      { a: 1, b: 1, c: 1 },
    ],
    "06"
  );
  t.end();
});

tap.test("07 - both input and override objects empty", (t) => {
  t.strictSame(objectBooleanCombinations({}, {}), [{}], "07");
  t.end();
});

// ==============================
// Edge cases
// ==============================

tap.test("08 - both inputs missing - throws", (t) => {
  t.throws(() => {
    objectBooleanCombinations();
  }, "08");
  t.end();
});

tap.test("09 - first input is not an object - throws", (t) => {
  t.throws(() => {
    objectBooleanCombinations("a");
  }, "09");
  t.end();
});

tap.test("10 - second input is not an object - throws", (t) => {
  t.throws(() => {
    objectBooleanCombinations("a", "a");
  }, "10.01");
  t.throws(() => {
    objectBooleanCombinations({ a: "a" }, "a");
  }, "10.02");
  t.end();
});

tap.test("11 - non-boolean object overrides - throws", (t) => {
  t.strictSame(
    objectBooleanCombinations(
      {
        a: 1,
        b: 0,
        c: 0,
        d: 0,
      },
      { a: "1", b: "1", c: "1" }
    ),
    [
      { a: "1", b: "1", c: "1", d: 0 },
      { a: "1", b: "1", c: "1", d: 1 },
    ],
    "11"
  );
  t.end();
});
