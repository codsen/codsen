const t = require("tap");
const allValuesEqualTo = require("../dist/object-all-values-equal-to.cjs");

// 01. B.A.U.
// -----------------------------------------------------------------------------

t.test("01.01 - nested objects", t => {
  t.same(
    allValuesEqualTo(
      {
        a: false,
        b: [
          {
            c: false
          },
          {
            d: false
          }
        ]
      },
      false
    ),
    true,
    "01.01.01"
  );
  t.same(
    allValuesEqualTo(
      {
        a: false,
        b: [
          {
            c: "" // <--- because of this
          },
          {
            d: false
          }
        ]
      },
      false
    ),
    false,
    "01.01.02"
  );
  t.end();
});

t.test("01.02 - nested array", t => {
  t.same(
    allValuesEqualTo(
      [
        {
          a: false
        },
        {
          b: false
        }
      ],
      false
    ),
    true,
    "01.02.01"
  );
  t.same(
    allValuesEqualTo(
      [
        {
          a: false
        },
        {
          b: false
        },
        1
      ],
      false
    ),
    false,
    "01.02.02"
  );
  t.same(allValuesEqualTo(["a"], false), false, "01.02.03");
  t.same(allValuesEqualTo([[]], false), true, "01.02.04");
  t.end();
});

t.test("01.03 - nulls", t => {
  t.same(allValuesEqualTo([null], null), false, "01.03.01");
  t.same(
    allValuesEqualTo([null], null, { arraysMustNotContainPlaceholders: false }),
    true,
    "01.03.02"
  );
  t.end();
});

t.test("01.04 - empty obj/arr", t => {
  t.same(allValuesEqualTo([], false), true, "01.04.01");
  t.same(allValuesEqualTo({}, false), true, "01.04.02");
  t.same(
    allValuesEqualTo(null, false),
    false,
    "01.04.03 - only valid for empty container-like types, array and plain object"
  );
  t.end();
});

// 02. Throws
// -----------------------------------------------------------------------------

t.test("02.01 - various throws", t => {
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
