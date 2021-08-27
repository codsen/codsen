import tap from "tap";
import { rightStopAtNewLines } from "../dist/string-left-right.esm.js";

// rightStopAtNewLines()
// -----------------------------------------------------------------------------

tap.test(`01 - calling at string length`, (t) => {
  t.equal(rightStopAtNewLines(""), null, "01.01");
  t.equal(rightStopAtNewLines("", null), null, "01.02");
  t.equal(rightStopAtNewLines("", undefined), null, "01.03");
  t.equal(rightStopAtNewLines("", 0), null, "01.04");
  t.equal(rightStopAtNewLines("", 1), null, "01.05");
  t.equal(rightStopAtNewLines("", 99), null, "01.06");
  t.equal(rightStopAtNewLines("abc", 3), null, "01.07");
  t.equal(rightStopAtNewLines("abc", 99), null, "01.08");
  t.end();
});

tap.test(`02 - normal use`, (t) => {
  t.notOk(!!rightStopAtNewLines(""), "02.01");
  t.notOk(!!rightStopAtNewLines("a"), "02.02");

  // zero was defaulted to, which is 'a', so to the right of it is 'b', index 1:
  t.equal(rightStopAtNewLines("ab"), 1, "02.03");

  // 2nd input arg was omitted so starting index is zero, which is "a".
  // Now, to the right of it, there's a space, index 1, next non-whitespace char
  // is b which is index 2.
  t.equal(rightStopAtNewLines("a b"), 2, "02.04");
  t.equal(rightStopAtNewLines("a b", 0), 2, "02.05");
  t.equal(rightStopAtNewLines("a b", 1), 2, "02.06");
  t.equal(rightStopAtNewLines("a b", 2), null, "02.07");

  t.equal(rightStopAtNewLines("a \n\n\nb"), 2, "02.08");
  t.equal(rightStopAtNewLines("a \n\n\nb", 0), 2, "02.09");
  t.equal(rightStopAtNewLines("a \n\n\nb", 1), 2, "02.10");
  t.equal(rightStopAtNewLines("a \n\n\nb", 2), 3, "02.11");
  t.equal(rightStopAtNewLines("a \n\n\nb", 3), 4, "02.12");
  t.equal(rightStopAtNewLines("a \n\n\nb", 4), 5, "02.13");
  t.equal(rightStopAtNewLines("a \n\n\nb", 5), null, "02.14");
  t.equal(rightStopAtNewLines("a \n\n\n\n"), 2, "02.15");
  t.equal(rightStopAtNewLines("a  "), null, "02.16");
  t.equal(rightStopAtNewLines("a  ", 0), null, "02.17");
  t.equal(rightStopAtNewLines("a  ", 1), null, "02.18");
  t.equal(rightStopAtNewLines("a  ", 2), null, "02.19");
  t.equal(rightStopAtNewLines("a  ", 3), null, "02.20");
  t.end();
});
