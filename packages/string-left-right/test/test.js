import test from "ava";
import { left, right } from "../dist/string-left-right.esm";

// 00. EDGE CASES (there are no throws as it's an internal library)
// -----------------------------------------------------------------------------

test(`00.01 - \u001b[${33}m${`null`}\u001b[${39}m - missing input`, t => {
  t.is(left(), null, "00.01.01");
  t.is(right(), null, "00.01.02");
});

test(`00.02 - \u001b[${33}m${`null`}\u001b[${39}m - non-string input`, t => {
  t.is(left(1), null, "00.02.01");
  t.is(right(1), null, "00.02.02");
});

test(`00.03 - \u001b[${33}m${`null`}\u001b[${39}m - non-string input`, t => {
  t.is(left(null), null, "00.03.01");
  t.is(left(null, 1), null, "00.03.02");
  t.is(right(null), null, "00.03.03");
  t.is(right(null, 1), null, "00.03.04");
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

// -----------------------------------------------------------------------------

//
//                                               ██\███/██
//                                               ███\█/███
//               ███x█x█x█x█x████████████████████████x█████
//                            .bug hammer.       ███/█\███
//                                               ██/███\██
//
