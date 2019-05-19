import test from "ava";
import compose from "../dist/ranges-compose.esm";
import clone from "lodash.clonedeep";
import apply from "ranges-apply";

function compare(t, str, older, newer, composed) {
  // sanity check
  t.deepEqual(apply(str, composed), apply(apply(str, older), newer));

  // real deal
  t.deepEqual(
    compose(
      str,
      older,
      newer
    ),
    composed
  );
}

// 01. just composing deletion operations
// ==========================

test("01.01 - deletion only - one vs one - #1", t => {
  // "abcd"
  // [0, 1] deletes "a" from "abcd", yielding "bcd"
  // [0, 1] deletes "b" from "bcd", yielding "cd"
  compare(t, "abcd", [[0, 1]], [[0, 1]], [[0, 2]]);
});

test("01.02 - deletion only - one vs one - #2", t => {
  // "abcd"
  // [1, 2] deletes "b" from "abcd", yielding "acd"
  // [0, 1] deletes "a" from "bcd", yielding "cd"
  compare(t, "abcd", [[1, 2]], [[0, 1]], [[0, 2]]);
});

test("01.03 - deletion only - one vs one - #3", t => {
  // "abcd"
  // [3, 4] deletes "d" from "abcd", yielding "abc"
  // [0, 1] deletes "a" from "abc", yielding "bc"
  compare(t, "abcd", [[3, 4]], [[0, 1]], [[0, 1], [3, 4]]);
});

test("01.04 - deletion only - one vs one - #4", t => {
  // "abcd"
  // [2, 3] deletes "c" from "abcd", yielding "abd"
  // [2, 3] deletes "d" from "abd", yielding "ab"
  compare(t, "abcd", [[2, 3]], [[2, 3]], [[2, 4]]);
});

test("01.05 - deletion only - one vs one - #5", t => {
  // "abcd"
  // [0, 1] deletes "a" from "abcd", yielding "bcd"
  // [2, 3] deletes "d" from "bcd", yielding "bc"
  compare(t, "abcd", [[0, 1]], [[2, 3]], [[0, 1], [3, 4]]);
});

test("01.06 - deletion only - one vs one - #6", t => {
  // "abcd"
  // [2, 3] deletes "c" from "abcd", yielding "abd"
  // [0, 2] deletes "d" from "abd", yielding "d"
  compare(t, "abcd", [[2, 3]], [[0, 2]], [[0, 3]]);
});

test("01.07 - deletion only - two mergeable vs one", t => {
  // "abcd"
  // [0, 1] deletes "a" from "abcd", yielding "bcd"
  // [1, 2] deletes "b" from "bcd", yielding "cd"
  // +
  // [0, 1] deletes "c" from "cd", yielding "d"
  compare(t, "abcd", [[0, 1], [1, 2]], [[0, 1]], [[0, 3]]);
});

test("01.08 - deletion only - one vs two mergeable", t => {
  // "abcd"
  // [0, 1] deletes "a" from "abcd", yielding "bcd"
  // +
  // [0, 1] deletes "b" from "bcd", yielding "cd"
  // [0, 1] deletes "c" from "cd", yielding "d"
  compare(t, "abcd", [[0, 1]], [[1, 2], [0, 1]], [[0, 3]]);
});

test("01.09 - deletion only - two unmergeable vs one", t => {
  // "abcdef"
  // [0, 1] deletes "a" from "abcdef", yielding "bcdef"
  // [2, 3] deletes "c" from "bcdef", yielding "bdef"
  // +
  // [0, 1] deletes "b" from "bdef", yielding "def"
  compare(t, "abcdef", [[0, 1], [2, 3]], [[0, 1]], [[0, 3]]);
});

test("01.10 - deletion only - two unmergeable vs two unmergeable #1", t => {
  // "abcdef"
  // [0, 1] deletes "a" from "abcdef", yielding "bcdef"
  // [2, 3] deletes "c" from "bcdef", yielding "bdef"
  // +
  // [0, 1] deletes "b" from "bdef", yielding "def"
  // [2, 3] deletes "e" from "bdef", yielding "df"
  compare(t, "abcdef", [[0, 1], [2, 3]], [[0, 1], [2, 3]], [[0, 3], [4, 5]]);
});

test("01.11 - deletion only - two unmergeable vs two unmergeable #2", t => {
  // "abcdefgh"
  // [0, 1] deletes "a"
  // [3, 5] deletes "de"
  //
  // yielding "bcfgh"
  //
  // [0, 1] deletes "b"
  // [2, 3] deletes "f"
  //
  // yielding "cgh"
  //
  // flat, composed equivalent against "abcdefgh": [[0, 2], [3, 6]]
  compare(t, "abcdefgh", [[0, 1], [3, 5]], [[0, 1], [2, 3]], [[0, 2], [3, 6]]);
});

test.only("01.12 - deletion only - two unmergeable vs two unmergeable #2", t => {
  // "abcdefgh" -> "bfgh"
  // "bfgh" -> "fh"
  // composed equivalent: [[0, 5], [6, 7]]

  compare(t, "abcdefgh", [[0, 1], [2, 5]], [[0, 1], [2, 3]], [[0, 5], [6, 7]]);
});

// 02. Adding then deletion
// -----------------------------------------------------------------------------

test("02.01 - adding + deletion - one vs one - #1", t => {
  const str = "abcdefghij";
  const ranges1 = [[0, 1, "xyz"]]; // yields "xyzbcdefghij"
  const ranges2 = [[1, 4]]; // yields "xcdefghij"
  t.deepEqual(
    compose(
      str,
      ranges1,
      ranges2
    ),
    [[0, 2, "x"]],
    "02.01"
  );
});

test("02.02 - adding + deletion - two vs one - #1", t => {
  const str = "abcdefghij";
  const ranges1 = [[0, 1, "xyz"], [3, 5, "klm"]]; // yields "xyzbcklmfghij"
  const ranges2 = [[1, 4]]; // yields "xcklmfghij"
  t.deepEqual(
    compose(
      str,
      ranges1,
      ranges2
    ),
    [[0, 2, "x"], [3, 5, "klm"]],
    "02.02"
  );
});

test("02.03 - adding + deletion - two vs one - #2", t => {
  const str = "abcdefghij";
  const ranges1 = [[0, 1, "xyz"], [3, 5, "klm"]]; // yields "xyzbcklmfghij"
  const ranges2 = [[1, 5]]; // yields "xklmfghij"
  t.deepEqual(
    compose(
      str,
      ranges1,
      ranges2
    ),
    [[0, 5, "xklm"]],
    "02.03"
  );
});
