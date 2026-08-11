// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import {
  chompLeft,
  chompRight,
  left,
  leftSeq,
  leftStopAtNewLines,
  leftStopAtRawNbsp,
  // leftStopAtNewLines,
  right,
  rightSeq,
  // chompLeft,
  // chompRight,
} from "../dist/string-left-right.esm.js";

// EDGE CASES (there are no throws as it's an internal library)
// -----------------------------------------------------------------------------

test("01", () => {
  equal(left(), null, "01.01");
  equal(right(), null, "01.02");
});

test("02", () => {
  equal(left(1), null, "02.01");
  equal(right(1), null, "02.02");
  equal(leftSeq(1, 1, "a"), null, "02.03");
  equal(rightSeq(1, 1, "a"), null, "02.04");
});

test("03", () => {
  equal(left(null), null, "03.01");
  equal(left(null, 1), null, "03.02");
  equal(right(null), null, "03.03");
  equal(right(null, 1), null, "03.04");
});

test("04 - sequence validation and second-position raw nbsp", () => {
  throws(() => leftSeq("abc", 1), /THROW_ID_01/, "04.01");
  throws(() => rightSeq("abc", 1), /THROW_ID_02/, "04.02");
  equal(leftStopAtRawNbsp("a\u00a0 b", 3), 1, "04.03");
  equal(leftStopAtNewLines("a\n b", 3), 1, "04.04");
});

test("05 - chomp modes at whitespace boundaries", () => {
  equal(chompRight("ax   ", 0, { mode: 2 }, "x"), 5, "05.01");
  equal(chompRight("ax  \n z", 0, { mode: 0 }, "x"), 4, "05.02");
  equal(chompLeft("   xa", 4, { mode: 2 }, "x"), 0, "05.03");
  equal(chompLeft("z \n  xa", 6, { mode: 0 }, "x"), 3, "05.04");
  equal(chompLeft("   xa", 4, { mode: 3 }, "x"), 0, "05.05");
});

test.run();
