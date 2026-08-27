// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import {
  isHighSurrogate,
  isLowSurrogate,
} from "../dist/string-character-is-astral-surrogate.esm.js";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01 - wrong/missing input = throw", () => {
  throws(
    () => {
      isHighSurrogate(1);
    },
    /THROW_ID_01/,
    "01.01",
  );
  throws(
    () => {
      isHighSurrogate(null);
    },
    /THROW_ID_01/,
    "01.02",
  );
  throws(
    () => {
      isHighSurrogate(true);
    },
    /THROW_ID_01/,
    "01.03",
  );

  throws(
    () => {
      isLowSurrogate(1);
    },
    /THROW_ID_02/,
    "01.04",
  );
  throws(
    () => {
      isLowSurrogate(null);
    },
    /THROW_ID_02/,
    "01.05",
  );
  throws(
    () => {
      isLowSurrogate(true);
    },
    /THROW_ID_02/,
    "01.06",
  );
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
    "04.04", // second Unicode code point (and onwards) doesn't matter
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
    "05.04", // second Unicode code point (and onwards) doesn't matter
  );
});

test("06 - UTF-16 surrogate boundaries", () => {
  equal(isHighSurrogate("\uD7FF"), false, "06.01");
  equal(isHighSurrogate("\uD800"), true, "06.02");
  equal(isHighSurrogate("\uDBFF"), true, "06.03");
  equal(isHighSurrogate("\uDC00"), false, "06.04");
  equal(isHighSurrogate("\uDFFF"), false, "06.05");
  equal(isHighSurrogate("\uE000"), false, "06.06");

  equal(isLowSurrogate("\uD7FF"), false, "06.07");
  equal(isLowSurrogate("\uD800"), false, "06.08");
  equal(isLowSurrogate("\uDBFF"), false, "06.09");
  equal(isLowSurrogate("\uDC00"), true, "06.10");
  equal(isLowSurrogate("\uDFFF"), true, "06.11");
  equal(isLowSurrogate("\uE000"), false, "06.12");
});

test.run();
