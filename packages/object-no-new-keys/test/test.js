import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { noNewKeys } from "../dist/object-no-new-keys.esm.js";

// ==========
// 01. B.A.U.
// ==========

test("01 - first level keys", () => {
  equal(
    noNewKeys(
      {
        a: "a",
        b: "b",
        c: "c",
      },
      {
        c: "z",
      },
    ),
    ["a", "b"],
    "01.01",
  );
});

test("02 - two level object", () => {
  equal(
    noNewKeys(
      {
        a: {
          b: "b",
          c: "c",
        },
        x: "y",
      },
      {
        a: {
          c: "z",
        },
      },
    ),
    ["a.b", "x"],
    "02.01",
  );
});

test("03 - object does not even exist on a reference", () => {
  equal(
    noNewKeys(
      {
        a: {
          b: "b",
          c: "c",
        },
        x: "y",
      },
      {
        a: "z",
      },
    ),
    ["a.b", "a.c", "x"],
    "03.01",
  );
});

test("04 - same as 01.03 but deeper levels", () => {
  equal(
    noNewKeys(
      {
        a: {
          b: {
            c: {
              d: "d",
              e: "e",
            },
          },
        },
      },
      {
        a: {
          b: {
            c: "c",
          },
        },
      },
    ),
    ["a.b.c.d", "a.b.c.e"],
    "04.01",
  );
});

// ====================
// 02. Involving arrays
// ====================

test("05 - objects within arrays", () => {
  equal(
    noNewKeys(
      {
        a: [
          {
            b: "aaa",
            d: "aaa",
          },
        ],
      },
      {
        a: [
          {
            b: "bbb",
          },
        ],
      },
    ),
    ["a[0].d"],
    "05.01",
  );
  equal(
    noNewKeys(
      {
        a: [
          {
            b: "aaa",
            d: "aaa",
            f: "fff",
          },
          {
            c: "aaa",
            k: "kkk",
          },
        ],
        x: "x",
      },
      {
        a: [
          {
            b: "bbb",
            c: "ccc",
          },
          {
            b: "yyy",
            c: "zzz",
          },
        ],
      },
    ),
    ["a[0].d", "a[0].f", "a[1].k", "x"],
    "05.02",
  );
  equal(
    noNewKeys(
      {
        a: [
          {
            b: "aaa",
            d: "aaa",
            f: "fff",
          },
          {
            c: "aaa",
            k: "kkk",
          },
        ],
        x: "x",
      },
      {
        a: [
          {
            b: "bbb",
            c: "ccc",
          },
        ],
      },
    ),
    ["a[0].d", "a[0].f", "a[1].k", "x"],
    "05.03",
  );
  equal(
    noNewKeys(
      {
        a: [
          {
            b: "aaa",
            d: "aaa",
            f: "fff",
          },
          {
            c: "aaa",
            k: "kkk",
          },
        ],
        x: "x",
      },
      {
        a: [
          {
            b: "bbb",
            c: "ccc",
          },
        ],
      },
      { mode: 1 },
    ),
    ["a[0].d", "a[0].f", "a[1].c", "a[1].k", "x"],
    "05.04",
  );
  equal(
    noNewKeys(
      {
        a: [
          {
            b: "aaa",
            d: "aaa",
            f: "fff",
          },
          {
            c: "aaa",
            k: "kkk",
          },
        ],
        x: "x",
      },
      {
        a: [
          {
            b: "bbb",
            c: "ccc",
          },
        ],
      },
      { mode: "1" },
    ),
    ["a[0].d", "a[0].f", "a[1].c", "a[1].k", "x"],
    "05.05",
  );
});

test("06 - other cases", () => {
  equal(
    noNewKeys(
      [
        {
          b: "aaa",
          d: "aaa",
        },
      ],
      "a",
    ),
    ["[0]"],
    "06.01",
  );
  equal(
    noNewKeys(
      {
        a: [
          {
            b: "aaa",
            d: "aaa",
          },
        ],
      },
      { a: "a" },
    ),
    ["a[0]"],
    "06.02",
  );
  equal(
    noNewKeys(
      {
        a: [
          {
            b: "aaa",
            d: "aaa",
          },
        ],
      },
      { a: ["a"] },
    ),
    ["a[0].b", "a[0].d"],
    "06.03",
  );
});

// ========================================
// 03. Different type inputs, strange cases
// ========================================

test("07 - array vs ..., can be inner recursion situation", () => {
  equal(noNewKeys(["a", "b", "c"]), ["[0]", "[1]", "[2]"], "07.01");
  equal(noNewKeys(["a", "b", "c"], "zzz"), ["[0]", "[1]", "[2]"], "07.02");
  equal(
    noNewKeys(["a", "b", "c"], { z: "zzz" }),
    ["[0]", "[1]", "[2]"],
    "07.03",
  );
  equal(
    noNewKeys(
      [
        {
          b: "aaa",
          d: "aaa",
        },
      ],
      ["a"],
    ),
    ["[0].b", "[0].d"],
    "07.04",
  );
});

test("08 - plain object vs ..., can be inner recursion situation", () => {
  equal(
    noNewKeys({
      a: "a",
      b: "b",
      c: "c",
    }),
    ["a", "b", "c"],
    "08.01",
  );
  equal(
    noNewKeys(
      {
        a: "a",
        b: "b",
        c: "c",
      },
      ["a"],
    ),
    ["a", "b", "c"],
    "08.02",
  );
});

test("09 - more complex plain object vs undefined (deeper levels won't be traversed if parents are not matching)", () => {
  equal(
    noNewKeys({
      a: "a",
      b: ["b"],
      c: {
        d: "d",
      },
    }),
    ["a", "b", "c"],
    "09.01",
  );
});

test("10 - more complex plain object vs empty object", () => {
  equal(
    noNewKeys(
      {
        a: "a",
        b: ["b"],
        c: {
          d: "d",
        },
      },
      {},
    ),
    ["a", "b", "c"],
    "10.01",
  );
});

test("11 - string vs string", () => {
  equal(noNewKeys("a", "b"), [], "11.01");
});

// ==========
// 04. Throws
// ==========

test("12 - mode.opts customised to a wrong type - throws", () => {
  throws(
    () => {
      noNewKeys({ a: "a" }, { b: "b" }, { mode: "z" });
    },
    /THROW_ID_01/,
    "12.01",
  );
  throws(
    () => {
      noNewKeys({ a: "a" }, { b: "b" }, { mode: 1.5 });
    },
    /THROW_ID_01/,
    "12.02",
  );
});

test("13 - mode is given as integer - throws", () => {
  throws(
    () => {
      noNewKeys({ a: "a" }, { b: "b" }, 1);
    },
    /THROW_ID_02/,
    "13.01",
  );
  throws(
    () => {
      noNewKeys({ a: "a" }, { b: "b" }, 2);
    },
    /THROW_ID_02/,
    "13.02",
  );
  throws(
    () => {
      noNewKeys({ a: "a" }, { b: "b" }, 2.5);
    },
    /THROW_ID_02/,
    "13.03",
  );
});

test.run();
