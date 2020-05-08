import tap from "tap";
import allValuesEqualTo from "../dist/object-all-values-equal-to.esm";

// 01. B.A.U.
// -----------------------------------------------------------------------------

tap.test("01 - nested objects", (t) => {
  t.same(
    allValuesEqualTo(
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
  t.same(
    allValuesEqualTo(
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
  t.end();
});

tap.test("02 - nested array", (t) => {
  t.same(
    allValuesEqualTo(
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
  t.same(
    allValuesEqualTo(
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
  t.same(allValuesEqualTo(["a"], false), false, "02.03");
  t.same(allValuesEqualTo([[]], false), true, "02.04");
  t.end();
});

tap.test("03 - nulls", (t) => {
  t.same(allValuesEqualTo([null], null), false, "03.01");
  t.same(
    allValuesEqualTo([null], null, { arraysMustNotContainPlaceholders: false }),
    true,
    "03.02"
  );
  t.end();
});

tap.test("04 - empty obj/arr", (t) => {
  t.same(allValuesEqualTo([], false), true, "04.01");
  t.same(allValuesEqualTo({}, false), true, "04.02");
  t.same(
    allValuesEqualTo(null, false),
    false,
    "04.03 - only valid for empty container-like types, array and plain object"
  );
  t.end();
});

// 02. Throws
// -----------------------------------------------------------------------------

tap.test("05 - various throws", (t) => {
  t.throws(() => {
    allValuesEqualTo();
  }, /THROW_ID_01/); // first arg missing - will throw

  t.throws(() => {
    allValuesEqualTo(1);
  }, /THROW_ID_02/); // second arg missing

  t.throws(() => {
    allValuesEqualTo(["a"], false, "zzz");
  }, /THROW_ID_03/); // third arg is not a plain obj

  t.end();
});
