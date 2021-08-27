import tap from "tap";
import { combinations } from "../dist/object-boolean-combinations.esm.js";

// ==============================
// Basic, no overrides
// ==============================

tap.test("01 - one property - 1, no override", (t) => {
  // non-boolean is supplied:
  t.strictSame(
    combinations({
      a: 0,
    }),
    [{ a: false }, { a: true }],
    "01.01"
  );
  t.strictSame(
    combinations({
      a: 1,
    }),
    [{ a: false }, { a: true }],
    "01.02"
  );

  // boolean is supplied:
  t.strictSame(
    combinations({
      a: false,
    }),
    [{ a: false }, { a: true }],
    "01.03"
  );
  t.strictSame(
    combinations({
      a: true,
    }),
    [{ a: false }, { a: true }],
    "01.04"
  );
  t.end();
});

tap.test("02 - three properties, no override", (t) => {
  // default - don't force bool

  t.strictSame(
    combinations({
      a: 1,
      b: 1,
      c: 1,
    }),
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
    "02.01"
  );
  t.strictSame(
    combinations({
      a: true,
      b: true,
      c: true,
    }),
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
    "02.02"
  );
  t.end();
});

tap.test("03 - non-boolean object overrides", (t) => {
  t.strictSame(
    combinations(
      {
        a: true,
        b: false,
        c: false,
        d: false,
      },
      { a: "1", b: "1", c: "1" }
    ),
    [
      { a: "1", b: "1", c: "1", d: false },
      { a: "1", b: "1", c: "1", d: true },
    ],
    "03"
  );
  t.end();
});
