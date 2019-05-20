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

// 01. One incoming
// -----------------------------------------------------------------------------

test("01.01 - one incoming - #1", t => {
  compare(t, "abcd", [[0, 1]], [[0, 1]], [[0, 2]]);
});

test("01.02 - one incoming - #2", t => {
  compare(t, "abcd", [[3, 5]], [[0, 1]], [[0, 1], [3, 5]]);
});

test("01.03 - one incoming - #3", t => {
  // newer ([0, 1]) fits into gap between older[0] ([0, 1]) and older[1] ([2, 3])
  compare(t, "abcd", [[0, 1], [2, 3]], [[0, 1]], [[0, 3]]);
});

test("01.04 - one incoming - #4", t => {
  // like above but with insertion
  compare(t, "abcd", [[0, 1], [2, 3]], [[0, 1, "xyz"]], [[0, 3, "xyz"]]);
});

test("01.05 - one incoming - #5", t => {
  // "jumps over" the second older range because there was enough "space"
  // to fix in the incoming "newer" range
  compare(t, "abcd", [[0, 1], [2, 3], [4, 5], [6, 7]], [[0, 4]], [[0, 8]]);
});

test("01.06 - one incoming - #6", t => {
  // with insertion
  compare(
    t,
    "abcd",
    [[0, 1], [2, 3], [4, 5], [6, 7]],
    [[0, 4, "klmnop"]],
    [[0, 8, "klmnop"]]
  );
});

// 02. just composing deletion operations
// -----------------------------------------------------------------------------

test("02.01 - deletion only - one vs one", t => {
  // "abcd"
  // [0, 1] deletes "a" from "abcd", yielding "bcd"
  // [0, 1] deletes "b" from "bcd", yielding "cd"
  compare(t, "abcd", [[0, 1]], [[0, 1]], [[0, 2]]);
});

test("02.02 - deletion only - one vs one", t => {
  // "abcd"
  // [1, 2] deletes "b" from "abcd", yielding "acd"
  // [0, 1] deletes "a" from "bcd", yielding "cd"
  compare(t, "abcd", [[1, 2]], [[0, 1]], [[0, 2]]);
});

test("02.03 - deletion only - one vs one", t => {
  // "abcd"
  // [1, 2] deletes "b" from "abcd", yielding "acd"
  // [0, 1] deletes "a" from "bcd", yielding "cd"
  compare(t, "abcd", [[1, 2]], [[0, 1]], [[0, 2]]);
});

test("02.04 - deletion only - one vs one", t => {
  // "abcdefghij" - "acdefghij"
  // "acdefghij" - "fghij"
  compare(t, "abcdefghij", [[1, 2]], [[0, 4]], [[0, 5]]);
});

test("02.05 - deletion only - one vs one", t => {
  // "abcd"
  // [0, 1] deletes "a" from "abcd", yielding "bcd"
  // [2, 3] deletes "d" from "bcd", yielding "bc"
  compare(t, "abcd", [[0, 1]], [[2, 3]], [[0, 1], [3, 4]]);
});

test("02.06 - deletion only - one vs one", t => {
  // "abcd"
  // [3, 4] deletes "d" from "abcd", yielding "abc"
  // [0, 1] deletes "a" from "abc", yielding "bc"
  compare(t, "abcd", [[3, 4]], [[0, 1]], [[0, 1], [3, 4]]);
});

test("02.07 - deletion only - one vs one", t => {
  // "abcd"
  // [2, 3] deletes "c" from "abcd", yielding "abd"
  // [2, 3] deletes "d" from "abd", yielding "ab"
  compare(t, "abcd", [[2, 3]], [[2, 3]], [[2, 4]]);
});

test("02.08 - deletion only - one vs one", t => {
  // "abcd"
  // [2, 3] deletes "c" from "abcd", yielding "abd"
  // [0, 2] deletes "d" from "abd", yielding "d"
  compare(t, "abcd", [[2, 3]], [[0, 2]], [[0, 3]]);
});

test("02.09 - deletion only - two mergeable vs one", t => {
  // "abcd"
  // [0, 1] deletes "a" from "abcd", yielding "bcd"
  // [1, 2] deletes "b" from "bcd", yielding "cd"
  // +
  // [0, 1] deletes "c" from "cd", yielding "d"
  compare(t, "abcd", [[0, 1], [1, 2]], [[0, 1]], [[0, 3]]);
});

test("02.10 - deletion only - one vs two mergeable", t => {
  // "abcd"
  // [0, 1] deletes "a" from "abcd", yielding "bcd"
  // +
  // [0, 1] deletes "b" from "bcd", yielding "cd"
  // [0, 1] deletes "c" from "cd", yielding "d"
  compare(t, "abcd", [[0, 1]], [[1, 2], [0, 1]], [[0, 3]]);
});

test("02.11 - deletion only - two unmergeable vs one", t => {
  // "abcdef"
  // [0, 1] deletes "a" from "abcdef", yielding "bcdef"
  // [2, 3] deletes "c" from "bcdef", yielding "bdef"
  // +
  // [0, 1] deletes "b" from "bdef", yielding "def"
  compare(t, "abcdef", [[0, 1], [2, 3]], [[0, 1]], [[0, 3]]);
});

test("02.12 - deletion only - two unmergeable vs two unmergeable", t => {
  // "abcdef"
  // [0, 1] deletes "a" from "abcdef", yielding "bcdef"
  // [2, 3] deletes "c" from "bcdef", yielding "bdef"
  // +
  // [0, 1] deletes "b" from "bdef", yielding "def"
  // [2, 3] deletes "e" from "bdef", yielding "df"
  compare(t, "abcdef", [[0, 1], [2, 3]], [[0, 1], [2, 3]], [[0, 3], [4, 5]]);
});

test("02.13 - deletion only - two unmergeable vs two unmergeable", t => {
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

test("02.14 - deletion only - two unmergeable vs two unmergeable", t => {
  // "abcdefgh" -> "bfgh"
  // "bfgh" -> "fh"
  // composed equivalent: [[0, 5], [6, 7]]

  compare(t, "abcdefgh", [[0, 1], [2, 5]], [[0, 1], [2, 3]], [[0, 5], [6, 7]]);
});

// 02. Adding then deletion
// -----------------------------------------------------------------------------

test("03.01 - adding + deletion - one vs one - #1", t => {
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
    "03.01"
  );
});

test("03.02 - adding + deletion - two vs one - #1", t => {
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
    "03.02"
  );
});

test("03.03 - adding + deletion - two vs one - #2", t => {
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
    "03.03"
  );
});
