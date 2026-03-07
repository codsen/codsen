// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import compare from "./util.js";

// Simple file, concentrate on row sorting, Balance, Credit & Debit col detection
// -------------------------------------------------------------------

test("01 - sorts a basic file, empty extra column in header", () => {
  compare(equal, "simples", "01");
});

test("02 - sorts a basic file, no headers", () => {
  compare(equal, "simples-no-header", "02");
});

test("03 - sorts a basic file with opposite order of the CSV entries", () => {
  compare(equal, "simples-backwards", "03");
});

test.run();
