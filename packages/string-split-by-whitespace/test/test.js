import test from "ava";
import strFindHeadsTails from "string-find-heads-tails";
import split from "../dist/string-split-by-whitespace.esm";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01.01 - wrong/missing input = throw", t => {
  t.throws(() => {
    split();
  });
  t.throws(() => {
    split(undefined);
  });

  t.deepEqual(split(1), 1, "01.01.03");
  t.deepEqual(split(null), null, "01.01.04");
  t.deepEqual(split(true), true, "01.01.05");
});

test("01.02 - empty string as input", t => {
  t.deepEqual(split(""), [], "01.02");
});

test("01.03 - opts contain non-array elements", t => {
  t.throws(() => {
    split("a b", { ignoreRanges: ["a"] });
  });
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

test("02.01 - splits two", t => {
  t.deepEqual(split("a b"), ["a", "b"], "02.01.01");
  t.deepEqual(split(" a  b "), ["a", "b"], "02.01.02");
  t.deepEqual(split("a  b "), ["a", "b"], "02.01.03");
  t.deepEqual(split("  a  b"), ["a", "b"], "02.01.04");
  t.deepEqual(split("\na\nb\n"), ["a", "b"], "02.01.05");
  t.deepEqual(split("\ta\tb\t"), ["a", "b"], "02.01.06");
  t.deepEqual(split("0\t0\t"), ["0", "0"], "02.01.07");
  t.deepEqual(
    split(
      "\n\n\n a      \n\n\n \t\t\t\t       b  \n\n\n \t\t\t\t   c   \n\n\n\n \t\t\t\t "
    ),
    ["a", "b", "c"],
    "02.01.08"
  );
  t.deepEqual(split("  some   text"), ["some", "text"], "02.01.09");
});

test("02.02 - single substring", t => {
  t.deepEqual(split("a"), ["a"], "02.02.01");
  t.deepEqual(split(" a"), ["a"], "02.02.02");
  t.deepEqual(split("a "), ["a"], "02.02.03");
  t.deepEqual(split(" a "), ["a"], "02.02.04");
  t.deepEqual(split("\na\n"), ["a"], "02.02.05");
  t.deepEqual(split("0"), ["0"], "02.02.06");
});

// -----------------------------------------------------------------------------
// 03. opts.ignoreRanges
// -----------------------------------------------------------------------------

test("03.01 - opts.ignoreRanges offset the start", t => {
  t.deepEqual(
    split("a b c d e", {
      ignoreRanges: [[0, 2]]
    }),
    ["b", "c", "d", "e"],
    "03.01.01"
  );
});

test("03.02 - starts from the middle of a string", t => {
  t.deepEqual(
    split("abcdef", {
      ignoreRanges: [[1, 5]]
    }),
    ["a", "f"],
    "03.02.01"
  );
});

test('03.03 - in tandem with package "strFindHeadsTails" - ignores heads and tails', t => {
  const input = "some interesting {{text}} {% and %} {{ some more }} text.";
  const headsAndTails = strFindHeadsTails(
    input,
    ["{{", "{%"],
    ["}}", "%}"]
  ).reduce((acc, curr) => {
    acc.push([curr.headsStartAt, curr.headsEndAt]);
    acc.push([curr.tailsStartAt, curr.tailsEndAt]);
    return acc;
  }, []);
  t.deepEqual(
    split(input, {
      ignoreRanges: headsAndTails
    }),
    ["some", "interesting", "text", "and", "some", "more", "text."],
    "03.03.01"
  );
});

test('03.04 - in tandem with package "strFindHeadsTails" - ignores whole variables', t => {
  const input = "some interesting {{text}} {% and %} {{ some more }} text.";
  const wholeVariables = strFindHeadsTails(
    input,
    ["{{", "{%"],
    ["}}", "%}"]
  ).reduce((acc, curr) => {
    acc.push([curr.headsStartAt, curr.tailsEndAt]);
    return acc;
  }, []);
  t.deepEqual(
    split(input, {
      ignoreRanges: wholeVariables
    }),
    ["some", "interesting", "text."],
    "03.04"
  );
});
