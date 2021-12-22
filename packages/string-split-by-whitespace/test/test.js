import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { strFindHeadsTails } from "string-find-heads-tails";

import { splitByW as split } from "../dist/string-split-by-whitespace.esm.js";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01 - wrong/missing input = throw", () => {
  throws(() => {
    split();
  }, /THROW_ID_01/g);
  throws(() => {
    split(undefined);
  }, /THROW_ID_01/g);

  equal(split(1), 1, "01.03");
  equal(split(null), null, "01.04");
  equal(split(true), true, "01.05");
});

test("02 - empty string as input", () => {
  equal(split(""), [], "02");
});

test("03 - opts contain non-array elements", () => {
  throws(() => {
    split("a b", { ignoreRanges: ["a"] });
  }, /THROW_ID_03/g);
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

test("04 - splits two", () => {
  equal(split("a b"), ["a", "b"], "04.01");
  equal(split(" a  b "), ["a", "b"], "04.02");
  equal(split("a  b "), ["a", "b"], "04.03");
  equal(split("  a  b"), ["a", "b"], "04.04");
  equal(split("\na\nb\n"), ["a", "b"], "04.05");
  equal(split("\ta\tb\t"), ["a", "b"], "04.06");
  equal(split("0\t0\t"), ["0", "0"], "04.07");
  equal(
    split(
      "\n\n\n a      \n\n\n \t\t\t\t       b  \n\n\n \t\t\t\t   c   \n\n\n\n \t\t\t\t "
    ),
    ["a", "b", "c"],
    "04.08"
  );
  equal(split("  some   text"), ["some", "text"], "04.09");
});

test("05 - single substring", () => {
  equal(split("a"), ["a"], "05.01");
  equal(split(" a"), ["a"], "05.02");
  equal(split("a "), ["a"], "05.03");
  equal(split(" a "), ["a"], "05.04");
  equal(split("\na\n"), ["a"], "05.05");
  equal(split("0"), ["0"], "05.06");
});

// -----------------------------------------------------------------------------
// 03. opts.ignoreRanges
// -----------------------------------------------------------------------------

test("06 - opts.ignoreRanges offset the start", () => {
  equal(
    split("a b c d e", {
      ignoreRanges: [[0, 2]],
    }),
    ["b", "c", "d", "e"],
    "06"
  );
});

test("07 - starts from the middle of a string", () => {
  equal(
    split("abcdef", {
      ignoreRanges: [[1, 5]],
    }),
    ["a", "f"],
    "07"
  );
});

test('08 - in tandem with package "strFindHeadsTails" - ignores heads and tails', () => {
  let input = "some interesting {{text}} {% and %} {{ some more }} text.";
  let headsAndTails = strFindHeadsTails(
    input,
    ["{{", "{%"],
    ["}}", "%}"]
  ).reduce((acc, curr) => {
    acc.push([curr.headsStartAt, curr.headsEndAt]);
    acc.push([curr.tailsStartAt, curr.tailsEndAt]);
    return acc;
  }, []);
  equal(
    split(input, {
      ignoreRanges: headsAndTails,
    }),
    ["some", "interesting", "text", "and", "some", "more", "text."],
    "08"
  );
});

test('09 - in tandem with package "strFindHeadsTails" - ignores whole variables', () => {
  let input = "some interesting {{text}} {% and %} {{ some more }} text.";
  let wholeVariables = strFindHeadsTails(
    input,
    ["{{", "{%"],
    ["}}", "%}"]
  ).reduce((acc, curr) => {
    acc.push([curr.headsStartAt, curr.tailsEndAt]);
    return acc;
  }, []);
  equal(
    split(input, {
      ignoreRanges: wholeVariables,
    }),
    ["some", "interesting", "text."],
    "09"
  );
});

test.run();
