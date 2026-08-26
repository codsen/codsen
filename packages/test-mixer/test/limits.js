// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { defaults, mixer } from "../dist/test-mixer.esm.js";

function booleanDefaults(count) {
  const result = {};
  for (let index = 0; index < count; index++) {
    result[`flag${index}`] = index % 2 === 0;
  }
  return result;
}

test("01 - validates the eager options object", () => {
  [null, [], "options", 0, () => {}, new Date()].forEach((value, index) => {
    throws(
      () => mixer({}, { enabled: true }, value),
      /^test-mixer\/mixer\(\): \[THROW_ID_04\]/u,
      `01.${String(index + 1).padStart(2, "0")}`,
    );
  });

  [0, -1, 1.5, NaN, Infinity, defaults.maxCombinations + 1, "4"].forEach(
    (maxCombinations, index) => {
      throws(
        () => mixer({}, { enabled: true }, { maxCombinations }),
        /^test-mixer\/mixer\(\): \[THROW_ID_05\]/u,
        `01.${String(index + 7).padStart(2, "0")}`,
      );
    },
  );

  equal(
    mixer({}, booleanDefaults(3), { maxCombinations: 8 }).length,
    8,
    "01.14",
  );
  throws(
    () => mixer({}, booleanDefaults(3), { maxCombinations: 7 }),
    /^test-mixer\/mixer\(\): \[THROW_ID_06\]/u,
    "01.15",
  );
});

test("02 - bounds exponential eager growth before allocation", () => {
  equal(mixer({}, booleanDefaults(13)).length, 8192, "02.01");
  equal(
    mixer({}, booleanDefaults(14)).length,
    defaults.maxCombinations,
    "02.02",
  );

  const fifteenKeys = booleanDefaults(15);
  throws(
    () => mixer({}, fifteenKeys),
    /\[THROW_ID_06\].*32768 rows \(2\^15\)/u,
    "02.03",
  );
  equal(
    mixer({ flag0: true }, fifteenKeys).length,
    defaults.maxCombinations,
    "02.04",
  );

  const nested = {};
  Object.defineProperty(nested, "explode", {
    enumerable: true,
    get() {
      throw new Error("the eager preflight did not run before cloning");
    },
  });
  throws(
    () => mixer({}, { ...fifteenKeys, nested }),
    /^test-mixer\/mixer\(\): \[THROW_ID_06\]/u,
    "02.05",
  );

  throws(
    () => mixer({}, booleanDefaults(1024)),
    /\[THROW_ID_06\].*2\^1024 rows/u,
    "02.06",
  );
});

test.run();
