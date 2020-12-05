import tap from "tap";
import objectBooleanCombinations from "../dist/object-boolean-combinations.esm";

// ==============================
// Basic, no overrides
// ==============================

tap.test("01 - one property - 1, no override", (t) => {
  // non-boolean is supplied:
  t.strictSame(
    objectBooleanCombinations({
      a: 1,
    }),
    [{ a: 0 }, { a: 1 }],
    "01.01"
  );
  t.strictSame(
    objectBooleanCombinations(
      {
        a: 1,
      },
      undefined,
      true
    ),
    [{ a: false }, { a: true }],
    "01.02"
  );

  // boolean is supplied:
  t.strictSame(
    objectBooleanCombinations({
      a: true,
    }),
    [{ a: 0 }, { a: 1 }],
    "01.03"
  );
  t.strictSame(
    objectBooleanCombinations(
      {
        a: true,
      },
      undefined,
      true
    ),
    [{ a: false }, { a: true }],
    "01.04"
  );
  t.end();
});

tap.test("02 - one property - 0, no override", (t) => {
  // non-boolean is supplied:
  t.strictSame(
    objectBooleanCombinations({
      a: 0,
    }),
    [{ a: 0 }, { a: 1 }],
    "02.01"
  );
  t.strictSame(
    objectBooleanCombinations(
      {
        a: 0,
      },
      undefined,
      true
    ),
    [{ a: false }, { a: true }],
    "02.02"
  );

  // boolean is supplied:
  t.strictSame(
    objectBooleanCombinations({
      a: false,
    }),
    [{ a: 0 }, { a: 1 }],
    "02.03"
  );
  t.strictSame(
    objectBooleanCombinations(
      {
        a: true,
      },
      undefined,
      true
    ),
    [{ a: false }, { a: true }],
    "02.04"
  );
  t.end();
});

tap.test("03 - three properties, no override", (t) => {
  // default - don't force bool

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
    "03.01"
  );
  t.strictSame(
    objectBooleanCombinations({
      a: true,
      b: true,
      c: true,
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
    "03.02"
  );

  // default hardcoded - don't force bool

  t.strictSame(
    objectBooleanCombinations(
      {
        a: 1,
        b: 1,
        c: 1,
      },
      undefined,
      false // <---- !!!
    ),
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
    "03.03"
  );
  t.strictSame(
    objectBooleanCombinations(
      {
        a: true,
        b: true,
        c: true,
      },
      undefined,
      false // <---- !!!
    ),
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
    "03.04"
  );

  // force bool

  t.strictSame(
    objectBooleanCombinations(
      {
        a: 1,
        b: 1,
        c: 1,
      },
      undefined,
      true // <---- !!!
    ),
    [
      { a: false, b: false, c: false },
      { a: true, b: false, c: false },
      { a: false, b: true, c: false },
      { a: true, b: true, c: false },
      { a: false, b: false, c: true },
      { a: true, b: false, c: true },
      { a: false, b: true, c: true },
      { a: true, b: true, c: true },
    ],
    "03.05"
  );
  t.strictSame(
    objectBooleanCombinations(
      {
        a: true,
        b: true,
        c: true,
      },
      undefined,
      true // <---- !!!
    ),
    [
      { a: false, b: false, c: false },
      { a: true, b: false, c: false },
      { a: false, b: true, c: false },
      { a: true, b: true, c: false },
      { a: false, b: false, c: true },
      { a: true, b: false, c: true },
      { a: false, b: true, c: true },
      { a: true, b: true, c: true },
    ],
    "03.06"
  );
  t.end();
});

tap.test("04 - non-boolean object overrides", (t) => {
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
    "04"
  );
  t.end();
});
