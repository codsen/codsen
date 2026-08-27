// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

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
  const invalidOverrides = [
    null,
    false,
    0,
    Number.NaN,
    "",
    [],
    new Date(),
    () => {},
    "a",
    1,
    true,
  ];

  invalidOverrides.forEach((invalidOverride, index) => {
    throws(
      () => {
        combinations({ a: "a" }, invalidOverride);
      },
      /object-boolean-combinations\/combinations\(\): \[THROW_ID_03\]/,
      `03.${String(index + 1).padStart(2, "0")}`,
    );
  });
});

test("04 - omitted and undefined overrides use the default", () => {
  equal(
    combinations({ a: "ignored" }),
    [{ a: false }, { a: true }],
    "04.01",
  );
  equal(
    combinations({ a: "ignored" }, undefined),
    [{ a: false }, { a: true }],
    "04.02",
  );
});

test.run();
