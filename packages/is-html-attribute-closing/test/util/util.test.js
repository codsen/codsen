import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { generateVariations, combinations } from "./util.js";

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
