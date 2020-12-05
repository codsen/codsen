import tap from "tap";
import objectBooleanCombinations from "../dist/object-boolean-combinations.esm";

// ==============================
// Overrides or slicing
// ==============================

tap.test("01 - three properties two overrides", (t) => {
  // default, truthy/falsy numbers are output

  t.strictSame(
    objectBooleanCombinations({ a: 0, b: 0, c: 0 }, { a: 1, b: 1 }),
    [
      { a: 1, b: 1, c: 0 },
      { a: 1, b: 1, c: 1 },
    ],
    "01.01"
  );
  t.strictSame(
    objectBooleanCombinations({ a: 0, b: 0, c: 0 }, { a: "z", b: "y" }),
    [
      { a: "z", b: "y", c: 0 },
      { a: "z", b: "y", c: 1 },
    ],
    "01.02 - override key values are strings"
  );
  t.strictSame(
    objectBooleanCombinations({ a: 0, b: 0, c: 0 }, { a: null, b: null }),
    [
      { a: null, b: null, c: 0 },
      { a: null, b: null, c: 1 },
    ],
    "01.03 - override key values are strings"
  );
  t.strictSame(
    objectBooleanCombinations({ a: 0, b: 0, c: 0 }, { a: ["x"], b: ["y"] }),
    [
      { a: ["x"], b: ["y"], c: 0 },
      { a: ["x"], b: ["y"], c: 1 },
    ],
    "01.04 - override key values are strings"
  );

  // request bool values
  // ---------------------------------------------------------------------------

  t.strictSame(
    objectBooleanCombinations({ a: 0, b: 0, c: 0 }, { a: 1, b: 1 }, true),
    [
      { a: 1, b: 1, c: false },
      { a: 1, b: 1, c: true },
    ],
    "01.05"
  );
  t.strictSame(
    objectBooleanCombinations({ a: 0, b: 0, c: 0 }, { a: true, b: true }, true),
    [
      { a: true, b: true, c: false },
      { a: true, b: true, c: true },
    ],
    "01.06"
  );
  t.strictSame(
    objectBooleanCombinations(
      { a: 0, b: 0, c: 0 },
      { a: true, b: false },
      true
    ),
    [
      { a: true, b: false, c: false },
      { a: true, b: false, c: true },
    ],
    "01.07"
  );
  t.strictSame(
    objectBooleanCombinations({ a: 0, b: 0, c: 0 }, { a: "z", b: "y" }, true),
    [
      { a: "z", b: "y", c: false },
      { a: "z", b: "y", c: true },
    ],
    "01.08 - override key values are strings"
  );
  t.strictSame(
    objectBooleanCombinations({ a: 0, b: 0, c: 0 }, { a: null, b: null }, true),
    [
      { a: null, b: null, c: false },
      { a: null, b: null, c: true },
    ],
    "01.09 - override key values are strings"
  );
  t.strictSame(
    objectBooleanCombinations(
      { a: 0, b: 0, c: 0 },
      { a: ["x"], b: ["y"] },
      true
    ),
    [
      { a: ["x"], b: ["y"], c: false },
      { a: ["x"], b: ["y"], c: true },
    ],
    "01.10 - override key values are strings"
  );

  t.strictSame(
    objectBooleanCombinations(
      { a: false, b: false, c: false },
      { a: true, b: true },
      true
    ),
    [
      { a: true, b: true, c: false },
      { a: true, b: true, c: true },
    ],
    "01.11"
  );
  t.strictSame(
    objectBooleanCombinations(
      { a: false, b: false, c: false },
      { a: false, b: false },
      true
    ),
    [
      { a: false, b: false, c: false },
      { a: false, b: false, c: true },
    ],
    "01.12"
  );
  t.strictSame(
    objectBooleanCombinations(
      { a: false, b: false, c: 0 },
      { a: false, b: false },
      true
    ),
    [
      { a: false, b: false, c: false },
      { a: false, b: false, c: true },
    ],
    "01.13"
  );
  t.strictSame(
    objectBooleanCombinations(
      { a: false, b: false, c: false },
      { a: "z", b: "y" },
      true
    ),
    [
      { a: "z", b: "y", c: false },
      { a: "z", b: "y", c: true },
    ],
    "01.14 - override key values are strings"
  );
  t.strictSame(
    objectBooleanCombinations(
      { a: false, b: false, c: false },
      { a: null, b: null },
      true
    ),
    [
      { a: null, b: null, c: false },
      { a: null, b: null, c: true },
    ],
    "01.15 - override key values are strings"
  );
  t.strictSame(
    objectBooleanCombinations(
      { a: false, b: false, c: false },
      { a: ["x"], b: ["y"] },
      true
    ),
    [
      { a: ["x"], b: ["y"], c: false },
      { a: ["x"], b: ["y"], c: true },
    ],
    "01.16 - override key values are strings"
  );
  t.strictSame(
    objectBooleanCombinations(
      { a: 0, b: 0, c: 0 },
      { a: ["x"], b: ["y"] },
      true
    ),
    [
      { a: ["x"], b: ["y"], c: false },
      { a: ["x"], b: ["y"], c: true },
    ],
    "01.17 - override key values are strings"
  );
  t.end();
});

tap.test("02 - four properties three overrides", (t) => {
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
    "02.01"
  );

  t.strictSame(
    objectBooleanCombinations(
      {
        a: 1,
        b: 0,
        c: 0,
        d: 0,
      },
      { a: true, b: true, c: true },
      true
    ),
    [
      {
        d: false,
        a: true,
        b: true,
        c: true,
      },
      {
        d: true,
        a: true,
        b: true,
        c: true,
      },
    ],
    "02.02"
  );

  t.strictSame(
    objectBooleanCombinations(
      {
        a: 1,
        b: 0,
        c: 0,
        d: 0,
      },
      { a: false, b: true, c: true },
      true
    ),
    [
      {
        d: false,
        a: false,
        b: true,
        c: true,
      },
      {
        d: true,
        a: false,
        b: true,
        c: true,
      },
    ],
    "02.03"
  );

  t.strictSame(
    objectBooleanCombinations(
      {
        a: 1,
        b: 0,
        c: 0,
        d: 0,
      },
      { a: false, b: true, c: false },
      true
    ),
    [
      {
        d: false,
        a: false,
        b: true,
        c: false,
      },
      {
        d: true,
        a: false,
        b: true,
        c: false,
      },
    ],
    "02.04"
  );

  t.strictSame(
    objectBooleanCombinations(
      {
        a: true,
        b: false,
        c: false,
        d: false,
      },
      { a: false, b: true, c: false },
      true
    ),
    [
      {
        d: false,
        a: false,
        b: true,
        c: false,
      },
      {
        d: true,
        a: false,
        b: true,
        c: false,
      },
    ],
    "02.05"
  );
  t.end();
});

// edge cases:

tap.test("03 - empty override object", (t) => {
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
    "03.01"
  );
  t.strictSame(
    objectBooleanCombinations({ a: 1, b: 0, c: 0 }, {}, false),
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
  t.strictSame(
    objectBooleanCombinations({ a: 1, b: 0, c: 0 }, {}, true),
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
    "03.03"
  );
  t.strictSame(
    objectBooleanCombinations({ a: 1, b: 0, c: 0 }, {}, 1),
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
    "03.04"
  );
  t.end();
});

tap.test("04 - override object is null", (t) => {
  t.strictSame(
    objectBooleanCombinations({ a: 1, b: 0, c: 0 }, null),
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
    "04.01"
  );
  t.strictSame(
    objectBooleanCombinations({ a: 1, b: 0, c: 0 }, null, false),
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
    "04.02"
  );
  t.strictSame(
    objectBooleanCombinations({ a: 1, b: 0, c: 0 }, null, true),
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
    "04.03"
  );
  t.end();
});

tap.test("05 - both input and override objects empty", (t) => {
  t.strictSame(objectBooleanCombinations({}, {}), [{}], "05.01");
  t.strictSame(objectBooleanCombinations({}, {}, false), [{}], "05.02");
  t.strictSame(objectBooleanCombinations({}, {}, true), [{}], "05.03");
  t.strictSame(objectBooleanCombinations({}, {}, 0), [{}], "05.04");
  t.strictSame(objectBooleanCombinations({}, {}, 1), [{}], "05.05");
  t.end();
});
