import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { combinations } from "../dist/object-boolean-combinations.esm.js";

// ==============================
// Edge cases
// ==============================

test("01 - both inputs missing - throws", () => {
  throws(
    () => {
      combinations();
    },
    /THROW_ID_01/,
    "01.01",
  );
  throws(
    () => {
      combinations(undefined);
    },
    /THROW_ID_01/,
    "01.02",
  );
  throws(
    () => {
      combinations(undefined, undefined);
    },
    /THROW_ID_01/,
    "01.03",
  );
  throws(
    () => {
      combinations(undefined, undefined, undefined);
    },
    /THROW_ID_01/,
    "01.04",
  );
  throws(
    () => {
      combinations(undefined, undefined, true);
    },
    /THROW_ID_01/,
    "01.05",
  );

  throws(
    () => {
      combinations(null);
    },
    /THROW_ID_01/,
    "01.06",
  );

  throws(
    () => {
      combinations(null, null);
    },
    /THROW_ID_01/,
    "01.07",
  );
});

test("02 - first input is not an object - throws", () => {
  throws(
    () => {
      combinations("a");
    },
    /THROW_ID_02/,
    "02.01",
  );

  // eslint-disable-next-line
  const fn = () => {};
  throws(
    () => {
      combinations(fn);
    },
    /THROW_ID_02/,
    "02.02",
  );

  throws(
    () => {
      combinations("a", "a");
    },
    /THROW_ID_02/,
    "02.03",
  );

  throws(
    () => {
      combinations("a", "a", true);
    },
    /THROW_ID_02/,
    "02.04",
  );
});

test("03 - second input is not an object - throws", () => {
  throws(
    () => {
      combinations({ a: "a" }, "a");
    },
    /THROW_ID_03/,
    "03.01",
  );
});

test.run();
