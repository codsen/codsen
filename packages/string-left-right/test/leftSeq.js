// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { leftSeq } from "../dist/string-left-right.esm.js";

// leftSeq()
// -----------------------------------------------------------------------------

test("01 - normal use", () => {
  // starts at "f":
  equal(
    leftSeq("abcdefghijk", 5, "c", "d", "e"),
    {
      gaps: [],
      leftmostChar: 2,
      rightmostChar: 4,
    },
    "01.01",
  );
  equal(
    leftSeq("a  b  c  d  e  f  g  h  i  j  k", 15, "c", "d", "e"),
    {
      gaps: [
        [7, 9],
        [10, 12],
        [13, 15],
      ],
      leftmostChar: 6,
      rightmostChar: 12,
    },
    "01.02",
  );
  equal(
    leftSeq("a  b  c  d  e  f  g  h  i  j  k", 15, "c", "d", "z?", "e"),
    {
      gaps: [
        [7, 9],
        [10, 12],
        [13, 15],
      ],
      leftmostChar: 6,
      rightmostChar: 12,
    },
    "01.03",
  );
  equal(
    leftSeq("a  b  c  d  e  f  g  h  i  j  k", 15, "c", "d", "z?", "e", "x?"),
    {
      gaps: [
        [7, 9],
        [10, 12],
        [13, 15],
      ],
      leftmostChar: 6,
      rightmostChar: 12,
    },
    "01.04",
  );
});

test("02 - no findings", () => {
  equal(leftSeq("abcdefghijklmnop", 0, "d", "e", "f"), null, "02.01");
  equal(leftSeq("abcdefghijklmnop", 2, "d", "e", "f"), null, "02.02");
  equal(leftSeq("abcdefghijklmnop", 2, "", ""), null, "02.03");
  equal(
    leftSeq("abcdefghijklmnop", 2, "b", ""),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 1,
    },
    "02.04",
  );
  equal(
    leftSeq("abcdefghijklmnop", 2, "", "b"),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 1,
    },
    "02.05",
  );
});

test("03 - starting point outside of the range", () => {
  equal(leftSeq("abcdefghijklmnop", 99, "d", "e", "f"), null, "03.01");
});

test("04 - case insensitive", () => {
  equal(leftSeq("abcdefghijk", 5, "C", "D", "E"), null, "04.01");
  equal(
    leftSeq("abcdefghijk", 5, { i: true }, "C", "D", "E"),
    {
      gaps: [],
      leftmostChar: 2,
      rightmostChar: 4,
    },
    "04.02",
  );
});

test("05 - hungry matches require the following value", () => {
  equal(leftSeq("bba", 2, "c", "b*"), null, "05.01");
  equal(
    leftSeq("cbba", 3, "c", "b*"),
    { gaps: [], leftmostChar: 0, rightmostChar: 2 },
    "05.02",
  );
  equal(
    leftSeq("c b b a", 6, "c", "b*"),
    {
      gaps: [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
      leftmostChar: 0,
      rightmostChar: 4,
    },
    "05.03",
  );
  equal(leftSeq("bba", 2, "c", "b?*"), null, "05.04");
  equal(leftSeq("bba", 2, "c", "b*?"), null, "05.05");
  equal(leftSeq("bba", 2, "c", "x?", "b*"), null, "05.06");
  equal(leftSeq("BBA", 2, { i: true }, "c", "b*"), null, "05.07");
  equal(
    leftSeq("CBBA", 3, { i: true }, "c", "b*"),
    { gaps: [], leftmostChar: 0, rightmostChar: 2 },
    "05.08",
  );
});

test.run();
