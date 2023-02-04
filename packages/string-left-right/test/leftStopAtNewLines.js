import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { leftStopAtNewLines } from "../dist/string-left-right.esm.js";

// leftStopAtNewLines()
// -----------------------------------------------------------------------------

test(`01 - null result cases`, () => {
  equal(leftStopAtNewLines("abc"), null, "01.01");
  equal(leftStopAtNewLines("abc", 0), null, "01.02");
  equal(leftStopAtNewLines("abc", null), null, "01.03");
  equal(leftStopAtNewLines("abc", 4), 2, "01.04");
  equal(leftStopAtNewLines("abc", 9), 2, "01.05");
  equal(leftStopAtNewLines(""), null, "01.06");
  equal(leftStopAtNewLines("", 0), null, "01.07");
  equal(leftStopAtNewLines("", null), null, "01.08");
  equal(leftStopAtNewLines("", undefined), null, "01.09");
  equal(leftStopAtNewLines("", 1), null, "01.10");
});

test(`02 - normal use`, () => {
  not.ok(!!leftStopAtNewLines(""), "02.01");
  not.ok(!!leftStopAtNewLines("a"), "02.02");
  equal(leftStopAtNewLines("ab", 1), 0, "02.01");
  equal(leftStopAtNewLines("a b", 2), 0, "02.02");

  equal(leftStopAtNewLines("a \n\n\nb", 5), 4, "02.03");
  equal(leftStopAtNewLines("a \n\n\n b", 6), 4, "02.04");
  equal(leftStopAtNewLines("a \r\r\r b", 6), 4, "02.05");
  equal(leftStopAtNewLines("a\n\rb", 3), 2, "02.06");
  equal(leftStopAtNewLines("a\n\r b", 4), 2, "02.07");

  equal(leftStopAtNewLines("\n\n\n\n", 4), 3, "02.08");
  equal(leftStopAtNewLines("\n\n\n\n", 3), 2, "02.09");
  equal(leftStopAtNewLines("\n\n\n\n", 2), 1, "02.10");
  equal(leftStopAtNewLines("\n\n\n\n", 1), 0, "02.11");
  equal(leftStopAtNewLines("\n\n\n\n", 0), null, "02.12");
});

test.run();
