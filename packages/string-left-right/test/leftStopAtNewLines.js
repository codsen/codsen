import tap from "tap";
import { leftStopAtNewLines } from "../dist/string-left-right.esm";

// leftStopAtNewLines()
// -----------------------------------------------------------------------------

tap.test(`01 - null result cases`, (t) => {
  t.equal(leftStopAtNewLines("abc"), null, "01.01 - assumed default");
  t.equal(leftStopAtNewLines("abc", 0), null, "01.02 - hardcoded default");
  t.equal(leftStopAtNewLines("abc", null), null, "01.03 - hardcoded default");
  t.equal(leftStopAtNewLines("abc", 4), 2, "01.04 - at string.length + 1");
  t.equal(
    leftStopAtNewLines("abc", 9),
    2,
    "01.05 - outside of the string.length"
  );
  t.equal(leftStopAtNewLines(""), null, "01.06");
  t.equal(leftStopAtNewLines("", 0), null, "01.07");
  t.equal(leftStopAtNewLines("", null), null, "01.08");
  t.equal(leftStopAtNewLines("", undefined), null, "01.09");
  t.equal(leftStopAtNewLines("", 1), null, "01.10");
  t.end();
});

tap.test(`02 - normal use`, (t) => {
  t.notOk(!!leftStopAtNewLines(""), "02.01");
  t.notOk(!!leftStopAtNewLines("a"), "02.02");
  t.equal(leftStopAtNewLines("ab", 1), 0, "02.03");
  t.equal(leftStopAtNewLines("a b", 2), 0, "02.04");

  t.equal(leftStopAtNewLines("a \n\n\nb", 5), 4, "02.05");
  t.equal(leftStopAtNewLines("a \n\n\n b", 6), 4, "02.06");
  t.equal(leftStopAtNewLines("a \r\r\r b", 6), 4, "02.07");
  t.equal(leftStopAtNewLines("a\n\rb", 3), 2, "02.08");
  t.equal(leftStopAtNewLines("a\n\r b", 4), 2, "02.09");

  t.equal(leftStopAtNewLines("\n\n\n\n", 4), 3, "02.10");
  t.equal(leftStopAtNewLines("\n\n\n\n", 3), 2, "02.11");
  t.equal(leftStopAtNewLines("\n\n\n\n", 2), 1, "02.12");
  t.equal(leftStopAtNewLines("\n\n\n\n", 1), 0, "02.13");
  t.equal(leftStopAtNewLines("\n\n\n\n", 0), null, "02.14");
  t.end();
});
