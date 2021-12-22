import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  isHighSurrogate,
  isLowSurrogate,
} from "../dist/string-character-is-astral-surrogate.esm.js";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01 - wrong/missing input = throw", () => {
  throws(() => {
    isHighSurrogate(1);
  }, "01.01");
  throws(() => {
    isHighSurrogate(null);
  }, "01.02");
  throws(() => {
    isHighSurrogate(true);
  }, "01.03");

  throws(() => {
    isLowSurrogate(1);
  }, "01.04");
  throws(() => {
    isLowSurrogate(null);
  }, "01.05");
  throws(() => {
    isLowSurrogate(true);
  }, "01.06");
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

// undefined must yield false - that's to make the life easier when
// checking the "next character". If it doesn't exist, it will be
// "false" and as far as the issue of surrogates is concerned, it's
// "false". This will save us from otherwise unnecessary if-else
// statements during traversal.
test("02 - undefined yields false", () => {
  // no arguments
  equal(isHighSurrogate(), false, "02.01");
  equal(isLowSurrogate(), false, "02.02");
  // undefined as primitive value
  equal(isHighSurrogate(undefined), false, "02.03");
  equal(isLowSurrogate(undefined), false, "02.04");
});

test("03 - empty string yields false", () => {
  equal(isHighSurrogate(""), false, "03.01");
  equal(isLowSurrogate(""), false, "03.02");
});

test("04 - isHighSurrogate()", () => {
  equal(isHighSurrogate("zzz"), false, "04.01");
  // 🧢 = \uD83E\uDDE2
  equal(isHighSurrogate("\uD83E"), true, "04.02");
  equal(isHighSurrogate("\uDDE2"), false, "04.03");
  equal(
    isHighSurrogate("\uD83E\uDDE2"),
    true,
    "04.04" // second Unicode code point (and onwards) doesn't matter
  );
});

test("05 - isLowSurrogate()", () => {
  equal(isLowSurrogate("zzz"), false, "05.01");
  // 🧢 = \uD83E\uDDE2
  equal(isLowSurrogate("\uD83E"), false, "05.02");
  equal(isLowSurrogate("\uDDE2"), true, "05.03");
  equal(
    isLowSurrogate("\uD83E\uDDE2"),
    false,
    "05.04" // second Unicode code point (and onwards) doesn't matter
  );
});

test.run();
