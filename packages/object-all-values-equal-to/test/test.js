import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

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
      false
    ),
    true,
    "01.01"
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
      false
    ),
    false,
    "01.02"
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
      false
    ),
    true,
    "02.01"
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
      false
    ),
    false,
    "02.02"
  );
  equal(allEq(["a"], false), false, "02.03");
  equal(allEq([[]], false), true, "02.04");
});

test("03 - nulls", () => {
  equal(allEq([null], null), false, "03.01");
  equal(
    allEq([null], null, { arraysMustNotContainPlaceholders: false }),
    true,
    "03.02"
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
    "05.01"
  ); // first arg missing - will throw

  throws(
    () => {
      allEq(1);
    },
    /THROW_ID_02/,
    "05.02"
  ); // second arg missing

  throws(
    () => {
      allEq(["a"], false, "zzz");
    },
    /THROW_ID_03/,
    "05.03"
  ); // third arg is not a plain obj
});

test.run();
