import test from "ava";
import mergeRanges from "../dist/ranges-merge.esm";
import clone from "lodash.clonedeep";

// 00. throws
// ==========================

test("00.01 - does not throw when the first arg is wrong", t => {
  t.deepEqual(mergeRanges("z"), "z", "00.01.01");
  t.deepEqual(mergeRanges(true), true, "00.01.02");
});

test("00.02 - throws when the second arg is wrong", t => {
  const error1 = t.throws(() => {
    mergeRanges([[1, 2], [0, 1]], 1);
  });
  t.regex(error1.message, /THROW_ID_01/);
});

// 01. mergeRanges()
// ==========================

test("01.01 - simples: merges three overlapping ranges", t => {
  const input = [[3, 8], [1, 4], [2, 5]];
  const inputBackup = clone(input);
  t.deepEqual(mergeRanges(input), [[1, 8]], "01.01.01 - two args");

  // input argument mutation checks:
  t.deepEqual(input, inputBackup, "01.01.02 - no mutation happened");
});

test("01.02 - nothing to merge", t => {
  t.deepEqual(
    mergeRanges([[3, 8], [1, 2]]),
    [[1, 2], [3, 8]],
    "01.02.01 - just sorted"
  );
});

test("01.03 - empty input", t => {
  t.deepEqual(mergeRanges([]), [], "01.03.01 - empty array");
  t.deepEqual(mergeRanges(null), null, "01.03.02 - null");
});

test("01.04 - more complex case", t => {
  let counter = 0;
  t.deepEqual(
    mergeRanges([[1, 5], [11, 15], [6, 10], [16, 20], [10, 30]]),
    [[1, 5], [6, 30]],
    "01.04.01"
  );
  t.deepEqual(
    mergeRanges([[1, 5], [11, 15], [6, 10], [16, 20], [10, 30]], perc => {
      // console.log(`done: ${perc}`);
      t.true(typeof perc === "number");
      counter++;
    }),
    [[1, 5], [6, 30]],
    "01.04.02"
  );
  t.true(counter > 5, "01.04.03");
});

test("01.05 - third arg", t => {
  t.deepEqual(
    mergeRanges([[3, 8, "c"], [1, 4, "a"], [2, 5, "b"]]),
    [[1, 8, "abc"]],
    "01.05.01"
  );
  t.deepEqual(
    mergeRanges([[3, 8, "c"], [1, 4], [2, 5, "b"]]),
    [[1, 8, "bc"]],
    "01.05.02"
  );
  t.deepEqual(
    mergeRanges([[3, 8, "c"], [1, 4, "a"], [2, 5]]),
    [[1, 8, "ac"]],
    "01.05.03"
  );
  t.deepEqual(
    mergeRanges([[3, 8], [1, 4, "a"], [2, 5, "b"]]),
    [[1, 8, "ab"]],
    "01.05.04"
  );
});

test("01.06 - more merging examples", t => {
  t.deepEqual(
    mergeRanges([[7, 14], [24, 28, " "], [29, 31], [28, 28, " "]]),
    [[7, 14], [24, 28, "  "], [29, 31]],
    "01.06.01"
  );
});

test("01.07 - superset range discards to-add content of their subset ranges #1", t => {
  t.deepEqual(mergeRanges([[5, 6, " "], [1, 10]]), [[1, 10]], "01.07");
});

test("01.08 - superset range discards to-add content of their subset ranges #2", t => {
  t.deepEqual(
    mergeRanges([[5, 7, " "], [6, 8, " "], [7, 9, " "], [1, 10]]),
    [[1, 10]],
    "01.08"
  );
});

test("01.09 - superset range discards to-add content of their subset ranges #3", t => {
  t.deepEqual(
    mergeRanges([[5, 7, " "], [1, 3, " "], [6, 8, " "], [7, 9, " "], [3, 10]]),
    [[1, 10, " "]],
    "01.09.01"
  );
  t.deepEqual(
    mergeRanges([[3, 10], [5, 7, " "], [1, 3, " "], [6, 8, " "], [7, 9, " "]]),
    [[1, 10, " "]],
    "01.09.02"
  );
  t.deepEqual(
    mergeRanges([[5, 7, " "], [1, 3, " "], [3, 10], [6, 8, " "], [7, 9, " "]]),
    [[1, 10, " "]],
    "01.09.03"
  );
  t.deepEqual(
    mergeRanges([[5, 7, " "], [1, 2, " "], [6, 8, " "], [7, 9, " "], [3, 10]]),
    [[1, 2, " "], [3, 10]],
    "01.09.04"
  );
});

test("01.10 - third arg is null", t => {
  t.deepEqual(
    mergeRanges([[3, 8, "c"], [1, 4, null], [2, 5, "b"]]),
    [[1, 8, null]],
    "01.10.01"
  );
  t.deepEqual(
    mergeRanges([[3, 8, "c"], [1, 4, null]]),
    [[1, 8, null]],
    "01.10.02"
  );
  t.deepEqual(
    mergeRanges([[1, 4, null], [3, 8, "c"]]),
    [[1, 8, null]],
    "01.10.03"
  );
  t.deepEqual(
    mergeRanges([[1, 4, "c"], [3, 8, null]]),
    [[1, 8, null]],
    "01.10.04"
  );
  t.deepEqual(
    mergeRanges([[3, 8, null], [1, 4, "c"]]),
    [[1, 8, null]],
    "01.10.05"
  );
});

test("01.11 - only one range, nothing to merge", t => {
  t.deepEqual(mergeRanges([[1, 4, null]]), [[1, 4, null]], "01.11.01");
  t.deepEqual(mergeRanges([[1, 4]]), [[1, 4]], "01.11.02");
});

test("01.12 - input arg mutation prevention", t => {
  const originalInput = [
    [5, 7, " "],
    [1, 3, " "],
    [6, 8, " "],
    [7, 9, " "],
    [3, 10]
  ];
  const originalRef = Array.from(originalInput); // clone it

  t.deepEqual(mergeRanges(originalInput), [[1, 10, " "]], "useless test");
  t.deepEqual(originalInput, originalRef, "01.12.01 - mutation didn't happen");
});

test("01.13 - only two identical args in the range", t => {
  t.deepEqual(
    mergeRanges([[1, 1], [3, 4], [2, 2, "zzz"]]),
    [[2, 2, "zzz"], [3, 4]],
    "01.13.01"
  );
  t.deepEqual(mergeRanges([[1, 1]]), [], "01.13.02");
});
