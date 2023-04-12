import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

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
