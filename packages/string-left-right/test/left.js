import tap from "tap";
import { left } from "../dist/string-left-right.esm";

// left()
// -----------------------------------------------------------------------------

tap.test(`01 - null result cases`, (t) => {
  t.equal(left("abc"), null, "01.01 - assumed default");
  t.equal(left("abc", 0), null, "01.02 - hardcoded default");
  t.equal(left("abc", null), null, "01.03 - hardcoded default");
  t.equal(left("abc", 4), 2, "01.04 - at string.length + 1");
  t.equal(left("abc", 9), 2, "01.05 - outside of the string.length");
  t.equal(left(""), null, "01.06");
  t.equal(left("", 0), null, "01.07");
  t.equal(left("", null), null, "01.08");
  t.equal(left("", undefined), null, "01.09");
  t.equal(left("", 1), null, "01.10");
  t.end();
});

tap.test(`02 - normal use`, (t) => {
  t.notOk(!!left(""), "02.01");
  t.notOk(!!left("a"), "02.02");
  t.equal(left("ab", 1), 0, "02.03");
  t.equal(left("a b", 2), 0, "02.04");
  t.equal(left("a \n\n\nb", 5), 0, "02.05");
  t.equal(left("\n\n\n\n", 4), null, "02.06");
  t.equal(left("\n\n\n\n", 3), null, "02.07");
  t.equal(left("\n\n\n\n", 2), null, "02.08");
  t.equal(left("\n\n\n\n", 1), null, "02.09");
  t.equal(left("\n\n\n\n", 0), null, "02.10");
  t.end();
});
