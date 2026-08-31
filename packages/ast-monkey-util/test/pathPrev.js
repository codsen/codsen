// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { pathNext, pathPrev } from "../dist/ast-monkey-util.esm.js";

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

test("09 - non-leading one is replaced with zero", () => {
  equal(pathPrev("9007199254740991"), "9007199254740990", "09.01");
  equal(pathPrev("1100000000000000"), "1099999999999999", "09.02");
  equal(
    pathPrev("root.children.1010000000000000"),
    "root.children.1009999999999999",
    "09.03",
  );
});

test("10 - long decimal differential and round-trip matrix", () => {
  let failures = [];
  for (let offset = 0n; offset < 10000n; offset += 1n) {
    let value = 1000000000000000n + offset;
    let valueAsString = value.toString();
    if (pathPrev(valueAsString) !== (value - 1n).toString()) {
      failures.push(`previous:${valueAsString}`);
    }
    if (pathPrev(pathNext(valueAsString)) !== valueAsString) {
      failures.push(`round-trip:${valueAsString}`);
    }
  }
  equal(failures, [], "10.01");
});

test.run();
