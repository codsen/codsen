import tap from "tap";
import { leftSeq } from "../dist/string-left-right.esm";

// leftSeq()
// -----------------------------------------------------------------------------

tap.test(`01 - normal use`, (t) => {
  // starts at "f":
  t.strictSame(
    leftSeq("abcdefghijk", 5, "c", "d", "e"),
    {
      gaps: [],
      leftmostChar: 2,
      rightmostChar: 4,
    },
    "01.01"
  );
  t.strictSame(
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
  t.strictSame(
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
  t.strictSame(
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
  t.end();
});

tap.test(`02 - no findings`, (t) => {
  t.equal(leftSeq("abcdefghijklmnop", 0, "d", "e", "f"), null, "02.01");
  t.equal(leftSeq("abcdefghijklmnop", 2, "d", "e", "f"), null, "02.02");
  t.equal(leftSeq("abcdefghijklmnop", 2, "", ""), null, "02.03");
  t.strictSame(
    leftSeq("abcdefghijklmnop", 2, "b", ""),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 1,
    },
    "02.04"
  );
  t.strictSame(
    leftSeq("abcdefghijklmnop", 2, "", "b"),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 1,
    },
    "02.05"
  );
  t.end();
});

tap.test(`04 - starting point outside of the range`, (t) => {
  t.equal(leftSeq("abcdefghijklmnop", 99, "d", "e", "f"), null, "04");
  t.end();
});

tap.test(`05 - case insensitive`, (t) => {
  t.equal(leftSeq("abcdefghijk", 5, "C", "D", "E"), null, "05.01");
  t.strictSame(
    leftSeq("abcdefghijk", 5, { i: true }, "C", "D", "E"),
    {
      gaps: [],
      leftmostChar: 2,
      rightmostChar: 4,
    },
    "05.02"
  );
  t.end();
});
