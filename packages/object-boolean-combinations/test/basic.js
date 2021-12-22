import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { combinations } from "../dist/object-boolean-combinations.esm.js";

// ==============================
// Basic, no overrides
// ==============================

test("01 - one property - 1, no override", () => {
  // non-boolean is supplied:
  equal(
    combinations({
      a: 0,
    }),
    [{ a: false }, { a: true }],
    "01.01"
  );
  equal(
    combinations({
      a: 1,
    }),
    [{ a: false }, { a: true }],
    "01.02"
  );

  // boolean is supplied:
  equal(
    combinations({
      a: false,
    }),
    [{ a: false }, { a: true }],
    "01.03"
  );
  equal(
    combinations({
      a: true,
    }),
    [{ a: false }, { a: true }],
    "01.04"
  );
});

test("02 - three properties, no override", () => {
  // default - don't force bool

  equal(
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
  equal(
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
});

test("03 - non-boolean object overrides", () => {
  equal(
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
});

test.run();
