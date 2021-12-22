import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { left } from "../dist/string-left-right.esm.js";

// left()
// -----------------------------------------------------------------------------

test(`01 - null result cases`, () => {
  equal(left("abc"), null, "01.01 - assumed default");
  equal(left("abc", 0), null, "01.02 - hardcoded default");
  equal(left("abc", null), null, "01.03 - hardcoded default");
  equal(left("abc", 4), 2, "01.04 - at string.length + 1");
  equal(left("abc", 9), 2, "01.05 - outside of the string.length");
  equal(left(""), null, "01.06");
  equal(left("", 0), null, "01.07");
  equal(left("", null), null, "01.08");
  equal(left("", undefined), null, "01.09");
  equal(left("", 1), null, "01.10");
});

test(`02 - normal use`, () => {
  not.ok(!!left(""), "02.01");
  not.ok(!!left("a"), "02.02");
  equal(left("ab", 1), 0, "02.03");
  equal(left("a b", 2), 0, "02.04");
  equal(left("a \n\n\nb", 5), 0, "02.05");
  equal(left("\n\n\n\n", 4), null, "02.06");
  equal(left("\n\n\n\n", 3), null, "02.07");
  equal(left("\n\n\n\n", 2), null, "02.08");
  equal(left("\n\n\n\n", 1), null, "02.09");
  equal(left("\n\n\n\n", 0), null, "02.10");
});

test.run();
