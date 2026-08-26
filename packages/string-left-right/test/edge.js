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

test("06 - leftward index normalization", () => {
  equal(left("abc", 4), 2, "06.01");
  equal(left("abc", Number.MAX_SAFE_INTEGER), 2, "06.02");
  equal(left("abc", Number.MAX_SAFE_INTEGER + 1), 2, "06.03");
  equal(left("abc", 2 ** 32 + 1), 2, "06.04");
  equal(left("abc", Number.MAX_VALUE), 2, "06.05");
  equal(left("abc", Infinity), null, "06.06");
  equal(left("abc", -Infinity), null, "06.07");
  equal(left("abc", Number.NaN), null, "06.08");
  equal(left("abc", 1.5), null, "06.09");
  equal(left("abc", -1), null, "06.10");

  equal(leftStopAtNewLines("abc", Number.MAX_VALUE), 2, "06.11");
  equal(leftStopAtNewLines("abc", Infinity), null, "06.12");
  equal(leftStopAtNewLines("abc", 1.5), null, "06.13");
  equal(leftStopAtNewLines("abc", -1), null, "06.14");
  equal(leftStopAtRawNbsp("abc", Number.MAX_VALUE), 2, "06.15");
  equal(leftStopAtRawNbsp("abc", Infinity), null, "06.16");
  equal(leftStopAtRawNbsp("abc", 1.5), null, "06.17");
  equal(leftStopAtRawNbsp("abc", -1), null, "06.18");

  let sequenceResult = {
    gaps: [
      [1, 2],
      [3, 4],
    ],
    leftmostChar: 0,
    rightmostChar: 4,
  };
  equal(
    leftSeq("a b c", Number.MAX_VALUE, "a", "b", "c"),
    sequenceResult,
    "06.19",
  );
  equal(leftSeq("a b c", Infinity, "a", "b", "c"), null, "06.20");
  equal(leftSeq("a b c", -Infinity, "a", "b", "c"), null, "06.21");
  equal(leftSeq("a b c", Number.NaN, "a", "b", "c"), null, "06.22");
  equal(leftSeq("a b c", 1.5, "a", "b", "c"), null, "06.23");
  equal(leftSeq("a b c", -1, "a", "b", "c"), null, "06.24");

  equal(chompLeft("a b c", Number.MAX_VALUE, "a", "b", "c"), 0, "06.25");
  equal(chompLeft("a b c", Infinity, "a", "b", "c"), null, "06.26");
  equal(chompLeft("a b c", -Infinity, "a", "b", "c"), null, "06.27");
  equal(chompLeft("a b c", Number.NaN, "a", "b", "c"), null, "06.28");
  equal(chompLeft("a b c", 1.5, "a", "b", "c"), null, "06.29");
  equal(chompLeft("a b c", -1, "a", "b", "c"), null, "06.30");
});

test.run();
