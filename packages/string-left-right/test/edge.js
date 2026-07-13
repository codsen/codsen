// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import {
  left,
  // rightStopAtNewLines,
  leftSeq,
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

test.run();
