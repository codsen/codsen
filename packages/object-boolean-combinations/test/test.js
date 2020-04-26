import tap from "tap";
import objectBooleanCombinations from "../dist/object-boolean-combinations.esm";

// ==============================
// Basic, no overrides
// ==============================

tap.test("01.01 - one property - 1, no override", (t) => {
  t.same(
    objectBooleanCombinations({
      a: 1,
    }),
    [{ a: 0 }, { a: 1 }],
    "01.01"
  );
  t.end();
});

tap.test("01.02 - one property - 0, no override", (t) => {
  t.same(
    objectBooleanCombinations({
      a: 0,
    }),
    [{ a: 0 }, { a: 1 }],
    "01.02"
  );
  t.end();
});

tap.test("01.03 - three properties, no override", (t) => {
  t.same(
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
    "01.03"
  );
  t.end();
});

// ==============================
// Overrides or slicing
// ==============================

tap.test("02.04 - three properties 2 overrides", (t) => {
  t.same(
    objectBooleanCombinations({ a: 0, b: 0, c: 0 }, { a: 1, b: 1 }),
    [
      { a: 1, b: 1, c: 0 },
      { a: 1, b: 1, c: 1 },
    ],
    "02.04.01"
  );
  t.same(
    objectBooleanCombinations({ a: 0, b: 0, c: 0 }, { a: "z", b: "y" }),
    [
      { a: "z", b: "y", c: 0 },
      { a: "z", b: "y", c: 1 },
    ],
    "02.04.02 - override key values are strings"
  );
  t.end();
});

tap.test("02.05 - four properties three overrides", (t) => {
  t.same(
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
    "02.05"
  );
  t.end();
});

// edge cases:

tap.test("02.06 - empty override object", (t) => {
  t.same(
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
    "02.06"
  );
  t.end();
});

tap.test("02.07 - both input and override objects empty", (t) => {
  t.same(objectBooleanCombinations({}, {}), [{}], "02.07");
  t.end();
});

// ==============================
// Edge cases
// ==============================

tap.test("03.01 - both inputs missing - throws", (t) => {
  t.throws(() => {
    objectBooleanCombinations();
  });
  t.end();
});

tap.test("03.02 - first input is not an object - throws", (t) => {
  t.throws(() => {
    objectBooleanCombinations("a");
  });
  t.end();
});

tap.test("03.03 - second input is not an object - throws", (t) => {
  t.throws(() => {
    objectBooleanCombinations("a", "a");
  });
  t.throws(() => {
    objectBooleanCombinations({ a: "a" }, "a");
  });
  t.end();
});

tap.test("03.04 - non-boolean object overrides - throws", (t) => {
  t.same(
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
    "03.04"
  );
  t.end();
});
