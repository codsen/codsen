// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

test("01 - tbc", () => {
  ok("TBC", "01.01");
});

test.run();
