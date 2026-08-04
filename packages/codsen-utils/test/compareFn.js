// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { compareFn } from "../dist/codsen-utils.esm.js";

test("01", () => {
  equal(compareFn("a", "b"), -1, "01.01");
});

test("02", () => {
  equal(compareFn("b", "a"), 1, "02.01");
});

test.run();
