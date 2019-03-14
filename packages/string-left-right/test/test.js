import test from "ava";
import {
  left,
  right,
  rightSeq,
  leftSeq,
  chompRight
} from "../dist/string-left-right.esm";

// 00. EDGE CASES (there are no throws as it's an internal library)
// -----------------------------------------------------------------------------

test(`00.01 - \u001b[${33}m${`null`}\u001b[${39}m - missing input`, t => {
  t.is(left(), null, "00.01.01");
  t.is(right(), null, "00.01.02");
  t.is(leftSeq(), null, "00.01.03");
  t.is(rightSeq(), null, "00.01.04");
});

test(`00.02 - \u001b[${33}m${`null`}\u001b[${39}m - non-string input`, t => {
  t.is(left(1), null, "00.02.01");
  t.is(right(1), null, "00.02.02");
  t.is(leftSeq(1, 1, "a"), null, "00.02.03");
  t.is(rightSeq(1, 1, "a"), null, "00.02.04");
});

test(`00.03 - \u001b[${33}m${`null`}\u001b[${39}m - non-string input`, t => {
  t.is(left(null), null, "00.03.01");
  t.is(left(null, 1), null, "00.03.02");
  t.is(right(null), null, "00.03.03");
  t.is(right(null, 1), null, "00.03.04");
  t.is(leftSeq(null), null, "00.03.05");
  t.is(leftSeq(null, 1), null, "00.03.06");
  t.is(rightSeq(null), null, "00.03.07");
  t.is(rightSeq(null, 1), null, "00.03.08");
});

// 01. left()
// -----------------------------------------------------------------------------

test(`01.01 - \u001b[${31}m${`left`}\u001b[${39}m - null result cases`, t => {
  t.is(left("abc"), null, "01.01.01 - assumed default");
  t.is(left("abc", 0), null, "01.01.02 - hardcoded default");
  t.is(left("abc", null), null, "01.01.03 - hardcoded default");
  t.is(left("abc", 4), 2, "01.01.04 - at string.length + 1");
  t.is(left("abc", 9), 2, "01.01.05 - outside of the string.length");
  t.is(left(""), null, "01.01.06");
  t.is(left("", 0), null, "01.01.07");
  t.is(left("", null), null, "01.01.08");
  t.is(left("", undefined), null, "01.01.09");
  t.is(left("", 1), null, "01.01.10");
});

test(`01.02 - \u001b[${31}m${`left`}\u001b[${39}m - normal use`, t => {
  t.false(!!left(""), "01.02.01");
  t.false(!!left("a"), "01.02.02");
  t.is(left("ab", 1), 0, "01.02.03");
  t.is(left("a b", 2), 0, "01.02.04");
  t.is(left("a \n\n\nb", 5), 0, "01.02.05");
  t.is(left("\n\n\n\n", 4), null, "01.02.06");
  t.is(left("\n\n\n\n", 3), null, "01.02.07");
  t.is(left("\n\n\n\n", 2), null, "01.02.08");
  t.is(left("\n\n\n\n", 1), null, "01.02.09");
  t.is(left("\n\n\n\n", 0), null, "01.02.10");
});

// 02. right()
// -----------------------------------------------------------------------------

test(`02.01 - \u001b[${34}m${`right`}\u001b[${39}m - calling at string length`, t => {
  t.is(right(""), null, "02.01.01");
  t.is(right("", null), null, "02.01.02");
  t.is(right("", undefined), null, "02.01.03");
  t.is(right("", 0), null, "02.01.04");
  t.is(right("", 1), null, "02.01.05");
  t.is(right("", 99), null, "02.01.06");
  t.is(right("abc", 3), null, "02.01.07");
  t.is(right("abc", 99), null, "02.01.08");
});

test(`02.02 - \u001b[${34}m${`right`}\u001b[${39}m - normal use`, t => {
  t.false(!!right(""), "02.02.01");
  t.false(!!right("a"), "02.02.02");

  // zero was defaulted to, which is 'a', so to the right of it is 'b', index 1:
  t.is(right("ab"), 1, "02.02.03");

  // 2nd input arg was omitted so starting index is zero, which is "a".
  // Now, to the right of it, there's a space, index 1, next non-whitespace char
  // is b which is index 2.
  t.is(right("a b"), 2, "02.02.04");

  t.is(right("a \n\n\nb"), 5, "02.02.05");
  t.is(right("a \n\n\n\n"), null, "02.02.06");
});

// 03. rightSeq()
// -----------------------------------------------------------------------------

test(`03.01 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - normal use`, t => {
  // starts at "c":
  t.deepEqual(
    rightSeq("abcdefghijklmnop", 2, "d"),
    {
      gaps: [],
      leftmostChar: 3,
      rightmostChar: 3
    },
    "03.01.01"
  );
  t.deepEqual(
    rightSeq("abcdefghijklmnop", 2, "d", "e", "f"),
    {
      gaps: [],
      leftmostChar: 3,
      rightmostChar: 5
    },
    "03.01.02"
  );
  t.deepEqual(
    rightSeq("a  b  c  d  e  f  g  h  i  j  k  l", 6, "d", "e", "f"),
    { gaps: [[7, 9], [10, 12], [13, 15]], leftmostChar: 9, rightmostChar: 15 },
    "03.01.03"
  );
});

test(`03.02 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - no findings`, t => {
  t.is(rightSeq("abcdefghijklmnop", 0, "d", "e", "f"), null, "03.02.01");
});

test(`03.03 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - absent skips to right()`, t => {
  t.is(rightSeq("abcdefghijklmnop", 0, "", ""), null, "03.03.01");
  t.deepEqual(
    rightSeq("abcdefghijklmnop", 0, "b", ""),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 1
    },
    "03.03.02"
  );
  t.deepEqual(
    rightSeq("abcdefghijklmnop", 0, "", "b"),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 1
    },
    "03.03.03"
  );
});

test(`03.04 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - no sequence arguments - turns into right()`, t => {
  t.is(rightSeq("abcdefghijklmnop", 0), 1, "03.04.01");
  t.is(rightSeq("abcdefghijklmnop", 1), 2, "03.04.02");
  t.is(rightSeq("ab  cdefghijklmnop", 1), 4, "03.04.03");
});

test(`03.05 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - starting point outside of the range`, t => {
  t.is(rightSeq("abcdefghijklmnop", 99, "d", "e", "f"), null, "03.05.01");
});

// 04. leftSeq()
// -----------------------------------------------------------------------------

test(`04.01 - \u001b[${36}m${`leftSeq`}\u001b[${39}m - normal use`, t => {
  // starts at "f":
  t.deepEqual(
    leftSeq("abcdefghijk", 5, "c", "d", "e"),
    {
      gaps: [],
      leftmostChar: 2,
      rightmostChar: 4
    },
    "04.01.01"
  );
  t.deepEqual(
    leftSeq("a  b  c  d  e  f  g  h  i  j  k", 15, "c", "d", "e"),
    { gaps: [[7, 9], [10, 12], [13, 15]], leftmostChar: 6, rightmostChar: 12 },
    "04.01.02"
  );
});

test(`04.02 - \u001b[${36}m${`leftSeq`}\u001b[${39}m - no findings`, t => {
  t.is(leftSeq("abcdefghijklmnop", 0, "d", "e", "f"), null, "04.02.01");
  t.is(leftSeq("abcdefghijklmnop", 2, "d", "e", "f"), null, "04.02.02");
  t.is(leftSeq("abcdefghijklmnop", 2, "", ""), null, "04.02.03");
  t.deepEqual(
    leftSeq("abcdefghijklmnop", 2, "b", ""),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 1
    },
    "04.02.04"
  );
  t.deepEqual(
    leftSeq("abcdefghijklmnop", 2, "", "b"),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 1
    },
    "04.02.05"
  );
});

test(`04.03 - \u001b[${36}m${`leftSeq`}\u001b[${39}m - no sequence arguments`, t => {
  t.is(leftSeq("abcdefghijklmnop", 0), null, "04.03.01");
  t.is(leftSeq("abcdefghijklmnop", 15), 14, "04.03.02");
  t.deepEqual(leftSeq("abcdefghijklmn p", 15), 13, "04.03.03");
  t.is(leftSeq("abcdefghijklmnop", 1), 0, "04.03.04");
  t.is(leftSeq("ab  cdefghijklmnop", 4), 1, "04.03.05");
});

test(`04.04 - \u001b[${36}m${`leftSeq`}\u001b[${39}m - starting point outside of the range`, t => {
  t.is(leftSeq("abcdefghijklmnop", 99, "d", "e", "f"), null, "04.04.01");
});

// 05. chompRight()
// -----------------------------------------------------------------------------

test(`05.01 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${34}m${`found`}\u001b[${39}m`} - mode: 0`, t => {
  t.is(chompRight("a b c d  c dx", 2, "c", "d"), 12, "05.01.01");
  t.is(chompRight("a b c d  c d x", 2, "c", "d"), 12, "05.01.02");
  t.is(chompRight("a b c d  c d  x", 2, "c", "d"), 13, "05.01.03");
  t.is(chompRight("a b c d  c d \nx", 2, "c", "d"), 13, "05.01.04");
  t.is(chompRight("a b c d  c d  \nx", 2, "c", "d"), 14, "05.01.05");
  // with hardcoded default opts
  const o = { mode: 0 };
  t.is(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "05.01.06");
  t.is(chompRight("a b c d  c d x", 2, o, "c", "d"), 12, "05.01.07");
  t.is(chompRight("a b c d  c d  x", 2, o, "c", "d"), 13, "05.01.08");
  t.is(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 13, "05.01.09");
  t.is(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 14, "05.01.10");
});

test(`05.02 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${34}m${`found`}\u001b[${39}m`} - mode: 1`, t => {
  // mode 1: stop at first space, leave whitespace alone
  const o = { mode: 1 };
  t.is(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "05.02.01");
  t.is(chompRight("a b c d  c d x", 2, o, "c", "d"), 12, "05.02.02");
  t.is(chompRight("a b c d  c d  x", 2, o, "c", "d"), 12, "05.02.03");
  t.is(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 12, "05.02.04");
  t.is(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 12, "05.02.05");
  t.is(chompRight("a b c d  c d  \t \nx", 2, o, "c", "d"), 12, "05.02.06");
});

test(`05.03 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${34}m${`found`}\u001b[${39}m`} - mode: 2`, t => {
  // mode 2: hungrily chomp all whitespace except newlines
  const o = { mode: 2 };
  t.is(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "05.03.01");
  t.is(chompRight("a b c d  c d x", 2, o, "c", "d"), 13, "05.03.02");
  t.is(chompRight("a b c d  c d  x", 2, o, "c", "d"), 14, "05.03.03");
  t.is(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 13, "05.03.04");
  t.is(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 14, "05.03.05");
  t.is(chompRight("a b c d  c d  \t \nx", 2, o, "c", "d"), 16, "05.03.06");
});

test(`05.04 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${34}m${`found`}\u001b[${39}m`} - mode: 3`, t => {
  // mode 3: aggressively chomp all whitespace
  const o = { mode: 3 };
  t.is(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "05.04.01");
  t.is(chompRight("a b c d  c d x", 2, o, "c", "d"), 13, "05.04.02");
  t.is(chompRight("a b c d  c d  x", 2, o, "c", "d"), 14, "05.04.03");
  t.is(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 14, "05.04.04");
  t.is(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 15, "05.04.05");
  t.is(chompRight("a b c d  c d  \t \nx", 2, o, "c", "d"), 17, "05.04.06");
});

test(`05.05 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${31}m${`not found`}\u001b[${39}m`} - all modes`, t => {
  t.is(chompRight("a b c d  c dx", 2, "z", "x"), null, "05.05.01");
  t.is(chompRight("a b c d  c dx", 2, { mode: 0 }, "z", "x"), null, "05.05.02");
  t.is(chompRight("a b c d  c dx", 2, { mode: 1 }, "z", "x"), null, "05.05.03");
  t.is(chompRight("a b c d  c dx", 2, { mode: 2 }, "z", "x"), null, "05.05.04");
  t.is(chompRight("a b c d  c dx", 2, { mode: 3 }, "z", "x"), null, "05.05.05");

  // idx is too high:
  t.is(chompRight("a b c d  c dx", 99, "z", "x"), null, "05.05.06");
  t.is(
    chompRight("a b c d  c dx", 99, { mode: 0 }, "z", "x"),
    null,
    "05.05.07"
  );
  t.is(
    chompRight("a b c d  c dx", 99, { mode: 1 }, "z", "x"),
    null,
    "05.05.08"
  );
  t.is(
    chompRight("a b c d  c dx", 99, { mode: 2 }, "z", "x"),
    null,
    "05.05.09"
  );
  t.is(
    chompRight("a b c d  c dx", 99, { mode: 3 }, "z", "x"),
    null,
    "05.05.10"
  );

  // no args -> null:
  t.is(chompRight("a b c d  c dx", 2), null, "05.05.11");
  t.is(chompRight("a b c d  c dx", 2, { mode: 0 }), null, "05.05.12");
  t.is(chompRight("a b c d  c dx", 2, { mode: 1 }), null, "05.05.13");
  t.is(chompRight("a b c d  c dx", 2, { mode: 2 }), null, "05.05.14");
  t.is(chompRight("a b c d  c dx", 2, { mode: 3 }), null, "05.05.15");
});

// -----------------------------------------------------------------------------

//
//                                               ██\███/██
//                                               ███\█/███
//               ███x█x█x█x█x███████████████████|████x████O
//                       ^ bug hammer ^          ███/█\███
//                  tears of the teared bugs     ██/███\██
//
