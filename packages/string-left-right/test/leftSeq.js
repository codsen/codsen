import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { leftSeq } from "../dist/string-left-right.esm.js";

// leftSeq()
// -----------------------------------------------------------------------------

test(`01 - normal use`, () => {
  // starts at "f":
  equal(
    leftSeq("abcdefghijk", 5, "c", "d", "e"),
    {
      gaps: [],
      leftmostChar: 2,
      rightmostChar: 4,
    },
    "01.01"
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
    "01.02"
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
    "01.03"
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
    "01.04"
  );
});

test(`02 - no findings`, () => {
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
    "02.04"
  );
  equal(
    leftSeq("abcdefghijklmnop", 2, "", "b"),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 1,
    },
    "02.05"
  );
});

test(`03 - starting point outside of the range`, () => {
  equal(leftSeq("abcdefghijklmnop", 99, "d", "e", "f"), null, "03");
});

test(`04 - case insensitive`, () => {
  equal(leftSeq("abcdefghijk", 5, "C", "D", "E"), null, "04.01");
  equal(
    leftSeq("abcdefghijk", 5, { i: true }, "C", "D", "E"),
    {
      gaps: [],
      leftmostChar: 2,
      rightmostChar: 4,
    },
    "04.02"
  );
});

test.run();
