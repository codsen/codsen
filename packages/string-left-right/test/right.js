import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { right } from "../dist/string-left-right.esm.js";

// right()
// -----------------------------------------------------------------------------

test("01 - calling at string length", () => {
  equal(right(""), null, "01.01");
  equal(right("", null), null, "01.02");
  equal(right("", undefined), null, "01.03");
  equal(right("", 0), null, "01.04");
  equal(right("", 1), null, "01.05");
  equal(right("", 99), null, "01.06");
  equal(right("abc", 3), null, "01.07");
  equal(right("abc", 99), null, "01.08");
});

test("02 - normal use", () => {
  not.ok(!!right(""), "02.01");
  not.ok(!!right("a"), "02.02");

  // zero was defaulted to, which is 'a', so to the right of it is 'b', index 1:
  equal(right("ab"), 1, "02.01");

  // 2nd input arg was omitted so starting index is zero, which is "a".
  // Now, to the right of it, there's a space, index 1, next non-whitespace char
  // is b which is index 2.
  equal(right("a b"), 2, "02.02");

  equal(right("a \n\n\nb"), 5, "02.03");
  equal(right("a \n\n\n\n"), null, "02.04");
});

test.run();
