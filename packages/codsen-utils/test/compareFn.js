import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compareFn } from "../dist/codsen-utils.esm.js";

test("01", () => {
  equal(compareFn("a", "b"), -1, "01.01");
});

test("02", () => {
  equal(compareFn("b", "a"), 1, "02.01");
});
