// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { remSep as r } from "../dist/string-remove-thousand-separators.esm.js";

test("01", () => {
  equal(r("0.075"), "0.075", "01.01");
});

test.run();
