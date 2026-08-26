// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { rightSeq } from "../dist/string-left-right.esm.js";

// rightSeq()
// -----------------------------------------------------------------------------

test("01 - normal use", () => {
  // starts at "c":
  equal(
    rightSeq("abcdefghijklmnop", 2, "d"),
    {
      gaps: [],
      leftmostChar: 3,
      rightmostChar: 3,
    },
    "01.01",
  );
  equal(
    rightSeq("abcdefghijklmnop", 2, "d", "e", "f"),
    {
      gaps: [],
      leftmostChar: 3,
      rightmostChar: 5,
    },
    "01.02",
  );
  equal(
    rightSeq("a  b  c  d  e  f  g  h  i  j  k  l", 6, "d", "e", "f"),
    {
      gaps: [
        [7, 9],
        [10, 12],
        [13, 15],
      ],
      leftmostChar: 9,
      rightmostChar: 15,
    },
    "01.03",
  );
});

test("02 - no findings", () => {
  equal(rightSeq("abcdefghijklmnop", 0, "d", "e", "f"), null, "02.01");
});

test("03 - absent skips to right()", () => {
  equal(rightSeq("abcdefghijklmnop", 0, "", ""), null, "03.01");
  equal(
    rightSeq("abcdefghijklmnop", 0, "b", ""),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 1,
    },
    "03.02",
  );
  equal(
    rightSeq("abcdefghijklmnop", 0, "", "b"),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 1,
    },
    "03.03",
  );
});

test("04 - starting point outside of the range", () => {
  equal(rightSeq("abcdefghijklmnop", 99, "d", "e", "f"), null, "04.01");
});

test("05 - optional - existing", () => {
  equal(
    rightSeq("abcdefghijklmnop", 2, "d?", "e?", "f"),
    {
      gaps: [],
      leftmostChar: 3,
      rightmostChar: 5,
    },
    "05.01",
  );
});

test(`06 - optional - 1 not existing, no whitespace`, () => {
  equal(
    rightSeq("abcefghijklmnop", 2, "d?", "e", "f"),
    {
      gaps: [],
      leftmostChar: 3,
      rightmostChar: 4,
    },
    "06.01",
  );
});

test(`07 - optional - 1 not existing, with whitespace`, () => {
  equal(
    rightSeq("abc  e   f   g   hijklmnop", 2, "d?", "e", "f"),
    {
      gaps: [
        [3, 5],
        [6, 9],
      ],
      leftmostChar: 5,
      rightmostChar: 9,
    },
    "07.01",
  );
});

test(`08 - optional - ends with non-existing optional`, () => {
  equal(
    rightSeq("abc  e   f   g   hijklmnop", 2, "y?", "e", "z?"),
    {
      gaps: [[3, 5]],
      leftmostChar: 5,
      rightmostChar: 5,
    },
    "08.01",
  );
});

test("09 - all optional, existing", () => {
  equal(
    rightSeq("abcdefghijklmnop", 2, "d?", "e?", "f?"),
    {
      gaps: [],
      leftmostChar: 3,
      rightmostChar: 5,
    },
    "09.01",
  );
});

test("10 - all optional, not existing", () => {
  equal(rightSeq("abcdefghijklmnop", 2, "x?"), null, "10.01");
  equal(rightSeq("abcdefghijklmnop", 2, "x?", "y?"), null, "10.02");
  equal(rightSeq("abcdefghijklmnop", 2, "x?", "y?", "z?"), null, "10.03");
});

test("11 - no findings", () => {
  equal(rightSeq("ABCDEFGHIJKLMNOP", 0, "b", "c", "d"), null, "11.01");
  equal(
    rightSeq("ABCDEFGHIJKLMNOP", 0, { i: true }, "b", "c", "d"),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 3,
    },
    "11.02",
  );
});

test("12 - hungry and optional-hungry flags", () => {
  equal(
    rightSeq("abbbbc", 0, "b*", "c"),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 5,
    },
    "12.01",
  );
  equal(
    rightSeq("abbbbc", 0, "b*?", "c"),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 5,
    },
    "12.02",
  );
  equal(
    rightSeq("ac", 0, "b?*", "c"),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 1,
    },
    "12.03",
  );
  equal(
    rightSeq("aBBBBc", 0, { i: true }, "b*", "c"),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 5,
    },
    "12.04",
  );
});

test("13 - does not crash when the sequence runs past the end", () => {
  // right() returns null once there is no solid character left, and the
  // case-insensitive branch used to call .toLowerCase() on str[null]
  equal(rightSeq("ab", 0, { i: true }, "b", "c"), null, "13.01");
  equal(rightSeq("ab", 0, { i: false }, "b", "c"), null, "13.02");
  // the same, reached through a hungry flag's lookahead
  equal(
    rightSeq("ab", 0, { i: true }, "b*"),
    { gaps: [], leftmostChar: 1, rightmostChar: 1 },
    "13.03",
  );
  equal(
    rightSeq("ab", 0, { i: false }, "b*"),
    { gaps: [], leftmostChar: 1, rightmostChar: 1 },
    "13.04",
  );
});

test("14 - hungry matches require the following value", () => {
  equal(rightSeq("abb", 0, "b*", "c"), null, "14.01");
  equal(
    rightSeq("abbc", 0, "b*", "c"),
    { gaps: [], leftmostChar: 1, rightmostChar: 3 },
    "14.02",
  );
  equal(
    rightSeq("a b b c", 0, "b*", "c"),
    {
      gaps: [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
      leftmostChar: 2,
      rightmostChar: 6,
    },
    "14.03",
  );
  equal(rightSeq("abb", 0, "b?*", "c"), null, "14.04");
  equal(rightSeq("abb", 0, "b*?", "c"), null, "14.05");
  equal(rightSeq("abb", 0, "b*", "x?", "c"), null, "14.06");
  equal(rightSeq("aBB", 0, { i: true }, "b*", "c"), null, "14.07");
  equal(
    rightSeq("aBBC", 0, { i: true }, "b*", "c"),
    { gaps: [], leftmostChar: 1, rightmostChar: 3 },
    "14.08",
  );
});

test.run();
