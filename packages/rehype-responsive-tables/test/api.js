// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import api from "rehype-responsive-tables";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

// API wirings
// -----------------------------------------------------------------------------

test("01 - a function is exported", () => {
  equal(typeof api, "function", "01.01");
});

test.run();
