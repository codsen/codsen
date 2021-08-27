import tap from "tap";
import { right } from "../dist/string-left-right.esm.js";

// right()
// -----------------------------------------------------------------------------

tap.test(`01 - calling at string length`, (t) => {
  t.equal(right(""), null, "01.01");
  t.equal(right("", null), null, "01.02");
  t.equal(right("", undefined), null, "01.03");
  t.equal(right("", 0), null, "01.04");
  t.equal(right("", 1), null, "01.05");
  t.equal(right("", 99), null, "01.06");
  t.equal(right("abc", 3), null, "01.07");
  t.equal(right("abc", 99), null, "01.08");
  t.end();
});

tap.test(`02 - normal use`, (t) => {
  t.notOk(!!right(""), "02.01");
  t.notOk(!!right("a"), "02.02");

  // zero was defaulted to, which is 'a', so to the right of it is 'b', index 1:
  t.equal(right("ab"), 1, "02.03");

  // 2nd input arg was omitted so starting index is zero, which is "a".
  // Now, to the right of it, there's a space, index 1, next non-whitespace char
  // is b which is index 2.
  t.equal(right("a b"), 2, "02.04");

  t.equal(right("a \n\n\nb"), 5, "02.05");
  t.equal(right("a \n\n\n\n"), null, "02.06");
  t.end();
});
