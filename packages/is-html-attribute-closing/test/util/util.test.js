// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { combinations, generateVariations } from "./util.js";

test("01", () => {
  equal(
    combinations('<a href="zzz">'),
    ["<a href='zzz'>", "<a href='zzz\">", "<a href=\"zzz'>", '<a href="zzz">'],
    "01.01",
  );
});

test("02", () => {
  equal(
    generateVariations([0, 1, 2], 2),
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    "02.01",
  );
});

test.run();
