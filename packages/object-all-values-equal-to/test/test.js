// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import vm from "node:vm";

import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { allEq } from "../dist/object-all-values-equal-to.esm.js";

// 01. B.A.U.
// -----------------------------------------------------------------------------

test("01 - nested objects", () => {
  equal(
    allEq(
      {
        a: false,
        b: [
          {
            c: false,
          },
          {
            d: false,
          },
        ],
      },
      false,
    ),
    true,
    "01.01",
  );
  equal(
    allEq(
      {
        a: false,
        b: [
          {
            c: "", // <--- because of this
          },
          {
            d: false,
          },
        ],
      },
      false,
    ),
    false,
    "01.02",
  );
});

test("02 - nested array", () => {
  equal(
    allEq(
      [
        {
          a: false,
        },
        {
          b: false,
        },
      ],
      false,
    ),
    true,
    "02.01",
  );
  equal(
    allEq(
      [
        {
          a: false,
        },
        {
          b: false,
        },
        1,
      ],
      false,
    ),
    false,
    "02.02",
  );
  equal(allEq(["a"], false), false, "02.03");
  equal(allEq([[]], false), true, "02.04");
});

test("03 - nulls", () => {
  equal(allEq([null], null), false, "03.01");
  equal(
    allEq([null], null, { arraysMustNotContainPlaceholders: false }),
    true,
    "03.02",
  );
});

test("04 - empty obj/arr", () => {
  equal(allEq([], false), true, "04.01");
  equal(allEq({}, false), true, "04.02");
  equal(allEq(null, false), false, "04.03");
});

// 02. Throws
// -----------------------------------------------------------------------------

test("05 - various throws", () => {
  throws(
    () => {
      allEq();
    },
    /THROW_ID_01/,
    "05.01",
  ); // first arg missing - will throw

  throws(
    () => {
      allEq(1);
    },
    /THROW_ID_02/,
    "05.02",
  ); // second arg missing

  throws(
    () => {
      allEq(["a"], false, "zzz");
    },
    /THROW_ID_03/,
    "05.03",
  ); // third arg is not a plain obj
});

test("06 - SameValueZero and structural placeholder comparisons", () => {
  equal(allEq([NaN], NaN), false, "06.01");
  equal(
    allEq([NaN], NaN, { arraysMustNotContainPlaceholders: false }),
    true,
    "06.02",
  );
  equal(allEq([-0], 0), false, "06.03");
  equal(allEq([{ a: [1, 2] }], { a: [1, 2] }), false, "06.04");
  equal(allEq([{ a: [1] }], { a: [1, 2] }), false, "06.05");
  equal(allEq([{ a: 1 }], { b: 1 }), false, "06.06");
  equal(allEq([{ a: 1 }], { a: 2 }), false, "06.07");
  equal(allEq([{ a: 1 }], { a: 1, b: 2 }), false, "06.08");
  equal(allEq([1], { a: 1 }), false, "06.09");
  equal(allEq([[1, 2]], [1, 3]), false, "06.10");
  equal(allEq([[1, 2]], { 0: 1, 1: 2 }), false, "06.11");
});

test("07 - date placeholders", () => {
  equal(allEq(new Date(0), new Date(0)), true, "07.01");
  equal(allEq(new Date(0), new Date(1)), false, "07.02");
  equal(allEq(new Date("invalid"), new Date("invalid")), true, "07.03");
  equal(allEq(vm.runInNewContext("new Date(0)"), new Date(0)), true, "07.04");
  equal(allEq(new Date(0), 0), false, "07.05");
});

test("08 - regular-expression placeholders", () => {
  equal(allEq(/a/gi, /a/gi), true, "08.01");
  equal(allEq(/a/g, /a/i), false, "08.02");
  equal(allEq(vm.runInNewContext("/a/gi"), /a/gi), true, "08.03");
  equal(allEq(/a/g, "a"), false, "08.04");
});

test.run();
