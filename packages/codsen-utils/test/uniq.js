// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { uniq } from "../dist/codsen-utils.esm.js";

test("01", () => {
  let input = [];
  equal(uniq(input), [], "01.01");
});

test("02", () => {
  let input = ["a", "c"];
  equal(uniq(input), ["a", "c"], "02.01");
});

test("03", () => {
  let input = ["a", "a", "c"];
  equal(uniq(input), ["a", "c"], "03.01");
});

test.run();
