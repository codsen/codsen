import tap from "tap";
import objectBooleanCombinations from "../dist/object-boolean-combinations.esm";

// ==============================
// Edge cases
// ==============================

tap.test("01 - both inputs missing - throws", (t) => {
  t.throws(
    () => {
      objectBooleanCombinations();
    },
    /THROW_ID_01/,
    "01.01"
  );
  t.throws(
    () => {
      objectBooleanCombinations(undefined);
    },
    /THROW_ID_01/,
    "01.02"
  );
  t.throws(
    () => {
      objectBooleanCombinations(undefined, undefined);
    },
    /THROW_ID_01/,
    "01.03"
  );
  t.throws(
    () => {
      objectBooleanCombinations(undefined, undefined, undefined);
    },
    /THROW_ID_01/,
    "01.04"
  );
  t.throws(
    () => {
      objectBooleanCombinations(undefined, undefined, true);
    },
    /THROW_ID_01/,
    "01.05"
  );

  t.throws(
    () => {
      objectBooleanCombinations(null);
    },
    /THROW_ID_01/,
    "01.06"
  );

  t.throws(
    () => {
      objectBooleanCombinations(null, null);
    },
    /THROW_ID_01/,
    "01.07"
  );
  t.end();
});

tap.test("02 - first input is not an object - throws", (t) => {
  t.throws(
    () => {
      objectBooleanCombinations("a");
    },
    /THROW_ID_02/,
    "02.01"
  );

  const fn = () => {};
  t.throws(
    () => {
      objectBooleanCombinations(fn);
    },
    /THROW_ID_02/,
    "02.02"
  );

  t.throws(
    () => {
      objectBooleanCombinations("a", "a");
    },
    /THROW_ID_02/,
    "02.03"
  );

  t.throws(
    () => {
      objectBooleanCombinations("a", "a", true);
    },
    /THROW_ID_02/,
    "02.04"
  );
  t.end();
});

tap.test("03 - second input is not an object - throws", (t) => {
  t.throws(
    () => {
      objectBooleanCombinations({ a: "a" }, "a");
    },
    /THROW_ID_03/,
    "03"
  );
  t.end();
});
