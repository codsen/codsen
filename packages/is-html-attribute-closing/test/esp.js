import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isAttrClosing as isCl } from "../dist/is-html-attribute-closing.esm.js";
// const BACKSLASH = "\u005C";

// ESP code cases
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${32}m${"ESP"}\u001b[${39}m`} - the Killer Triplet`, () => {
  let str = '<a b="c{{ z("\'") }}"><b>';
  ok(isCl(str, 5, 19), "01.01");
});

test(`02 - ${`\u001b[${32}m${"ESP"}\u001b[${39}m`} - Ruby ERB`, () => {
  let str = '<a href="https://abc?p1=<%= @p1 %>&p2=<%= @p2 %>">';
  ok(isCl(str, 8, 48), "02.01");
});

test.run();
