// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { comb } from "./util/util.js";

// emoji
// -----------------------------------------------------------------------------

test("01 - doesn't affect emoji characters within the code", () => {
  let actual = comb("<td>🦄</td>").result;
  let intended = "<td>🦄</td>";

  equal(actual, intended, "01.01");
});

test("02 - doesn't affect emoji characters within the attribute names", () => {
  let actual = comb('<td data-emoji="🦄">emoji</td>').result;
  let intended = '<td data-emoji="🦄">emoji</td>';

  equal(actual, intended, "02.01");
});

test.run();
