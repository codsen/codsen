import tap from "tap";
import objectBooleanCombinations from "../dist/object-boolean-combinations.esm";

// ==============================
// Overrides or slicing
// ==============================

tap.test("01 - three properties two overrides", (t) => {
  // default, truthy/falsy numbers are output

  t.strictSame(
    objectBooleanCombinations(
      { a: false, b: false, c: false },
      { a: true, b: true }
    ),
    [
      { a: true, b: true, c: false },
      { a: true, b: true, c: true },
    ],
    "01.01"
  );
  t.strictSame(
    objectBooleanCombinations(
      { a: false, b: false, c: false },
      { a: "z", b: "y" }
    ),
    [
      { a: "z", b: "y", c: false },
      { a: "z", b: "y", c: true },
    ],
    "01.02 - override key values are strings"
  );
  t.strictSame(
    objectBooleanCombinations(
      { a: false, b: false, c: false },
      { a: null, b: null }
    ),
    [
      { a: null, b: null, c: false },
      { a: null, b: null, c: true },
    ],
    "01.03 - override key values are strings"
  );
  t.strictSame(
    objectBooleanCombinations(
      { a: false, b: false, c: false },
      { a: ["x"], b: ["y"] }
    ),
    [
      { a: ["x"], b: ["y"], c: false },
      { a: ["x"], b: ["y"], c: true },
    ],
    "01.04 - override key values are strings"
  );
  t.end();
});

tap.test("02 - four properties three overrides", (t) => {
  t.strictSame(
    objectBooleanCombinations(
      {
        a: true,
        b: false,
        c: false,
        d: false,
      },
      { a: true, b: true, c: true }
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
    "02"
  );

  t.end();
});

// edge cases:

tap.test("03 - empty override object", (t) => {
  t.strictSame(
    objectBooleanCombinations({ a: true, b: false, c: false }, {}),
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
    "03"
  );
  t.end();
});

tap.test("04 - override object is null", (t) => {
  t.strictSame(
    objectBooleanCombinations({ a: true, b: false, c: false }, null),
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
    "04"
  );
  t.end();
});

tap.test("05 - both input and override objects empty", (t) => {
  t.strictSame(objectBooleanCombinations({}, {}), [{}], "05");
  t.end();
});
