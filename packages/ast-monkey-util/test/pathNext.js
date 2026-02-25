// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { pathNext } from "../dist/ast-monkey-util.esm.js";

test("01", () => {
  equal(pathNext("0"), "1", "01.01");
});

test("02", () => {
  equal(pathNext("1"), "2", "02.01");
});

test("03", () => {
  equal(pathNext("1.z"), "1.z", "03.01");
});

test("04", () => {
  equal(pathNext("9.children.3"), "9.children.4", "04.01");
});

test("05", () => {
  equal(
    pathNext("9.children.1.children.0"),
    "9.children.1.children.1",
    "05.01",
  );
});

test("06 - edge cases", () => {
  equal(pathNext(""), "1", "06.01");
  throws(
    () => {
      pathNext();
    },
    /ast-monkey-util\/pathNext\(\): \[THROW_ID_02]/,
    "06.02",
  );
});

test.run();
