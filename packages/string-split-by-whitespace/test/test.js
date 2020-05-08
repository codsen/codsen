import tap from "tap";
import strFindHeadsTails from "string-find-heads-tails";
import split from "../dist/string-split-by-whitespace.esm";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

tap.test("01 - wrong/missing input = throw", (t) => {
  t.throws(() => {
    split();
  }, /THROW_ID_01/g);
  t.throws(() => {
    split(undefined);
  }, /THROW_ID_01/g);

  t.same(split(1), 1, "01.03");
  t.same(split(null), null, "01.04");
  t.same(split(true), true, "01.05");
  t.end();
});

tap.test("02 - empty string as input", (t) => {
  t.same(split(""), [], "02");
  t.end();
});

tap.test("03 - opts contain non-array elements", (t) => {
  t.throws(() => {
    split("a b", { ignoreRanges: ["a"] });
  }, /THROW_ID_03/g);
  t.end();
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

tap.test("04 - splits two", (t) => {
  t.same(split("a b"), ["a", "b"], "04.01");
  t.same(split(" a  b "), ["a", "b"], "04.02");
  t.same(split("a  b "), ["a", "b"], "04.03");
  t.same(split("  a  b"), ["a", "b"], "04.04");
  t.same(split("\na\nb\n"), ["a", "b"], "04.05");
  t.same(split("\ta\tb\t"), ["a", "b"], "04.06");
  t.same(split("0\t0\t"), ["0", "0"], "04.07");
  t.same(
    split(
      "\n\n\n a      \n\n\n \t\t\t\t       b  \n\n\n \t\t\t\t   c   \n\n\n\n \t\t\t\t "
    ),
    ["a", "b", "c"],
    "04.08"
  );
  t.same(split("  some   text"), ["some", "text"], "04.09");
  t.end();
});

tap.test("05 - single substring", (t) => {
  t.same(split("a"), ["a"], "05.01");
  t.same(split(" a"), ["a"], "05.02");
  t.same(split("a "), ["a"], "05.03");
  t.same(split(" a "), ["a"], "05.04");
  t.same(split("\na\n"), ["a"], "05.05");
  t.same(split("0"), ["0"], "05.06");
  t.end();
});

// -----------------------------------------------------------------------------
// 03. opts.ignoreRanges
// -----------------------------------------------------------------------------

tap.test("06 - opts.ignoreRanges offset the start", (t) => {
  t.same(
    split("a b c d e", {
      ignoreRanges: [[0, 2]],
    }),
    ["b", "c", "d", "e"],
    "06"
  );
  t.end();
});

tap.test("07 - starts from the middle of a string", (t) => {
  t.same(
    split("abcdef", {
      ignoreRanges: [[1, 5]],
    }),
    ["a", "f"],
    "07"
  );
  t.end();
});

tap.test(
  '08 - in tandem with package "strFindHeadsTails" - ignores heads and tails',
  (t) => {
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
    t.same(
      split(input, {
        ignoreRanges: headsAndTails,
      }),
      ["some", "interesting", "text", "and", "some", "more", "text."],
      "08"
    );
    t.end();
  }
);

tap.test(
  '09 - in tandem with package "strFindHeadsTails" - ignores whole variables',
  (t) => {
    const input = "some interesting {{text}} {% and %} {{ some more }} text.";
    const wholeVariables = strFindHeadsTails(
      input,
      ["{{", "{%"],
      ["}}", "%}"]
    ).reduce((acc, curr) => {
      acc.push([curr.headsStartAt, curr.tailsEndAt]);
      return acc;
    }, []);
    t.same(
      split(input, {
        ignoreRanges: wholeVariables,
      }),
      ["some", "interesting", "text."],
      "09"
    );
    t.end();
  }
);
