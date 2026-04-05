// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { isAttrClosing as isCl } from "../dist/is-html-attribute-closing.esm.js";

// const BACKSLASH = "\u005C";

// ESP code cases
// -----------------------------------------------------------------------------

test(`01 - ESP - the Killer Triplet`, () => {
  let str = '<a b="c{{ z("\'") }}"><b>';
  ok(isCl(str, 5, 19), "01.01");
});

test(`02 - ESP - Ruby ERB`, () => {
  let str = '<a href="https://abc?p1=<%= @p1 %>&p2=<%= @p2 %>">';
  ok(isCl(str, 8, 48), "02.01");
});

test.run();
