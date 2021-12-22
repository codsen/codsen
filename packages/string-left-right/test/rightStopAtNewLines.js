import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { rightStopAtNewLines } from "../dist/string-left-right.esm.js";

// rightStopAtNewLines()
// -----------------------------------------------------------------------------

test(`01 - calling at string length`, () => {
  equal(rightStopAtNewLines(""), null, "01.01");
  equal(rightStopAtNewLines("", null), null, "01.02");
  equal(rightStopAtNewLines("", undefined), null, "01.03");
  equal(rightStopAtNewLines("", 0), null, "01.04");
  equal(rightStopAtNewLines("", 1), null, "01.05");
  equal(rightStopAtNewLines("", 99), null, "01.06");
  equal(rightStopAtNewLines("abc", 3), null, "01.07");
  equal(rightStopAtNewLines("abc", 99), null, "01.08");
});

test(`02 - normal use`, () => {
  not.ok(!!rightStopAtNewLines(""), "02.01");
  not.ok(!!rightStopAtNewLines("a"), "02.02");

  // zero was defaulted to, which is 'a', so to the right of it is 'b', index 1:
  equal(rightStopAtNewLines("ab"), 1, "02.03");

  // 2nd input arg was omitted so starting index is zero, which is "a".
  // Now, to the right of it, there's a space, index 1, next non-whitespace char
  // is b which is index 2.
  equal(rightStopAtNewLines("a b"), 2, "02.04");
  equal(rightStopAtNewLines("a b", 0), 2, "02.05");
  equal(rightStopAtNewLines("a b", 1), 2, "02.06");
  equal(rightStopAtNewLines("a b", 2), null, "02.07");

  equal(rightStopAtNewLines("a \n\n\nb"), 2, "02.08");
  equal(rightStopAtNewLines("a \n\n\nb", 0), 2, "02.09");
  equal(rightStopAtNewLines("a \n\n\nb", 1), 2, "02.10");
  equal(rightStopAtNewLines("a \n\n\nb", 2), 3, "02.11");
  equal(rightStopAtNewLines("a \n\n\nb", 3), 4, "02.12");
  equal(rightStopAtNewLines("a \n\n\nb", 4), 5, "02.13");
  equal(rightStopAtNewLines("a \n\n\nb", 5), null, "02.14");
  equal(rightStopAtNewLines("a \n\n\n\n"), 2, "02.15");
  equal(rightStopAtNewLines("a  "), null, "02.16");
  equal(rightStopAtNewLines("a  ", 0), null, "02.17");
  equal(rightStopAtNewLines("a  ", 1), null, "02.18");
  equal(rightStopAtNewLines("a  ", 2), null, "02.19");
  equal(rightStopAtNewLines("a  ", 3), null, "02.20");
});

test.run();
