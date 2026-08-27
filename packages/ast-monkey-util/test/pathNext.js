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

test("07 - exact decimal arithmetic beyond the safe integer range", () => {
  equal(pathNext("9007199254740991"), "9007199254740992", "07.01");
  equal(pathNext("9007199254740992"), "9007199254740993", "07.02");
  equal(
    pathNext("9999999999999999999999999999999999999999"),
    "10000000000000000000000000000000000000000",
    "07.03",
  );
  equal(
    pathNext("root.children.99999999999999999999"),
    "root.children.100000000000000000000",
    "07.04",
  );
  equal(pathNext("00000000000000000000000000000042"), "43", "07.05");
  equal(pathNext("00000000000000000000000000000000"), "1", "07.06");
});

test.run();
