// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import compare from "./util.js";

// 2D Trim
// -------------------------------------------------------------------

test("01 - trims right side cols and bottom rows", () => {
  compare(equal, "simples-2d-trim", "01");
});

test("02 - trims all around, including left-side empty columns", () => {
  compare(equal, "all-round-simples-trim", "02");
});

test.run();
