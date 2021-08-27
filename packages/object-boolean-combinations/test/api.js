import tap from "tap";
import { combinations } from "../dist/object-boolean-combinations.esm.js";

// ==============================
// Edge cases
// ==============================

tap.test("01 - both inputs missing - throws", (t) => {
  t.throws(
    () => {
      combinations();
    },
    /THROW_ID_01/,
    "01.01"
  );
  t.throws(
    () => {
      combinations(undefined);
    },
    /THROW_ID_01/,
    "01.02"
  );
  t.throws(
    () => {
      combinations(undefined, undefined);
    },
    /THROW_ID_01/,
    "01.03"
  );
  t.throws(
    () => {
      combinations(undefined, undefined, undefined);
    },
    /THROW_ID_01/,
    "01.04"
  );
  t.throws(
    () => {
      combinations(undefined, undefined, true);
    },
    /THROW_ID_01/,
    "01.05"
  );

  t.throws(
    () => {
      combinations(null);
    },
    /THROW_ID_01/,
    "01.06"
  );

  t.throws(
    () => {
      combinations(null, null);
    },
    /THROW_ID_01/,
    "01.07"
  );
  t.end();
});

tap.test("02 - first input is not an object - throws", (t) => {
  t.throws(
    () => {
      combinations("a");
    },
    /THROW_ID_02/,
    "02.01"
  );

  // eslint-disable-next-line
  const fn = () => {};
  t.throws(
    () => {
      combinations(fn);
    },
    /THROW_ID_02/,
    "02.02"
  );

  t.throws(
    () => {
      combinations("a", "a");
    },
    /THROW_ID_02/,
    "02.03"
  );

  t.throws(
    () => {
      combinations("a", "a", true);
    },
    /THROW_ID_02/,
    "02.04"
  );
  t.end();
});

tap.test("03 - second input is not an object - throws", (t) => {
  t.throws(
    () => {
      combinations({ a: "a" }, "a");
    },
    /THROW_ID_03/,
    "03"
  );
  t.end();
});
