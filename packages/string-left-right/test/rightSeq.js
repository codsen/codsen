import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

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

test(`06 - ${`\u001b[${31}m${"optional"}\u001b[${39}m`} - 1 not existing, no whitespace`, () => {
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

test(`07 - ${`\u001b[${31}m${"optional"}\u001b[${39}m`} - 1 not existing, with whitespace`, () => {
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

test(`08 - ${`\u001b[${31}m${"optional"}\u001b[${39}m`} - ends with non-existing optional`, () => {
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

test.run();
