// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { pathPrev } from "../dist/ast-monkey-util.esm.js";

test("01", () => {
  equal(pathPrev(""), null, "01.01");
});

test("02", () => {
  equal(pathPrev("0"), null, "02.01");
});

test("03", () => {
  equal(pathPrev("1"), "0", "03.01");
});

test("04", () => {
  equal(pathPrev("1.z"), null, "04.01");
});

test("05", () => {
  equal(pathPrev("9.children.33"), "9.children.32", "05.01");
});

test("06", () => {
  equal(
    pathPrev("9.children.1.children.2"),
    "9.children.1.children.1",
    "06.01",
  );
});

test("07 - edge cases", () => {
  equal(pathPrev("00"), null, "07.01");
  throws(
    () => {
      pathPrev();
    },
    /ast-monkey-util\/pathPrev\(\): \[THROW_ID_03]/,
    "07.02",
  );
});

test("08 - exact decimal arithmetic beyond the safe integer range", () => {
  equal(pathPrev("9007199254740993"), "9007199254740992", "08.01");
  equal(pathPrev("9007199254740992"), "9007199254740991", "08.02");
  equal(
    pathPrev("10000000000000000000000000000000000000000"),
    "9999999999999999999999999999999999999999",
    "08.03",
  );
  equal(
    pathPrev("root.children.100000000000000000000"),
    "root.children.99999999999999999999",
    "08.04",
  );
  equal(pathPrev("00000000000000000000000000000042"), "41", "08.05");
  equal(pathPrev("00000000000000000000000000000001"), "0", "08.06");
  equal(pathPrev("00000000000000000000000000000000"), null, "08.07");
});

test.run();
