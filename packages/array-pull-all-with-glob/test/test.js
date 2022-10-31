import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { pull } from "../dist/array-pull-all-with-glob.esm.js";

// =======
// no glob
// =======

test("01 - no glob", () => {
  equal(pull(["one", "two", "three"], ["one", "three"]), ["two"], "01.01");
});

test("02 - won't find", () => {
  equal(
    pull(["one", "two", "three"], ["something"]),
    ["one", "two", "three"],
    "02.01"
  );
});

test("03 - empty source array", () => {
  equal(pull([], ["one", "three"]), [], "03.01");
});

test("04 - empty source array", () => {
  equal(pull([], []), [], "04.01");
});

test("05 - no glob, deletes last remaining thing", () => {
  equal(pull(["one"], ["one"]), [], "05.01");
});

test("06 - no glob, case sensitive", () => {
  equal(
    pull(["One", "two", "Three"], ["one", "three"]),
    ["One", "two", "Three"],
    "06.01 - default"
  );
  equal(
    pull(["One", "two", "Three"], ["one", "three"], { caseSensitive: false }),
    ["two"],
    "06.02 - opts.caseSensitive"
  );
});

// ====
// glob
// ====

test("07 - glob, normal use", () => {
  equal(
    pull(
      [
        "module-1",
        "only this left",
        "module-2",
        "module-3",
        "elements",
        "elemental",
      ],
      ["module-*", "something else", "element*"]
    ),
    ["only this left"],
    "07.01"
  );
  equal(
    pull(
      [
        "Module-1",
        "only this left",
        "module-2",
        "module-3",
        "elements",
        "elemental",
      ],
      ["module-*", "something else", "element*"]
    ),
    ["Module-1", "only this left"],
    "07.02"
  );
  equal(
    pull(
      [
        "Module-1",
        "only this left",
        "module-2",
        "module-3",
        "elements",
        "elemental",
      ],
      ["module-*", "something else", "element*"],
      { caseSensitive: false }
    ),
    ["only this left"],
    "07.03"
  );
});

test("08 - asterisk the only input - pulls everything", () => {
  equal(
    pull(
      [
        "module-1",
        "only this left",
        "module-2",
        "module-3",
        "elements",
        "elemental",
      ],
      ["*"] // <------ array
    ),
    [],
    "08.01"
  );
  equal(
    pull(
      [
        "module-1",
        "only this left",
        "module-2",
        "module-3",
        "elements",
        "elemental",
      ],
      "*" // <---- string
    ),
    [],
    "08.02"
  );
});

test("09 - asterisk in the source array", () => {
  equal(
    pull(
      ["module-*", "module-**", "something-*", "something-**"],
      ["module-*"]
    ),
    ["something-*", "something-**"],
    "09.01"
  );
});

test("10 - empty arrays as inputs", () => {
  equal(pull([], ["module-*"]), [], "10.01");
});

test("11 - empty array as second arg", () => {
  equal(
    pull(["module-*", "module-**", "something-*", "something-**"], []),
    ["module-*", "module-**", "something-*", "something-**"],
    "11.01"
  );
});

test("12 - pulls normal words in various ways", () => {
  equal(pull(["apples", "oranges"], "apples"), ["oranges"], "12.01");
  equal(pull(["apples", "oranges"], ["apples"]), ["oranges"], "12.02");
  equal(pull(["apples", "oranges"], ["apples*"]), ["oranges"], "12.03");
  equal(pull(["apples", "oranges"], "apples*"), ["oranges"], "12.04");
  equal(pull(["apples", "oranges"], "a*"), ["oranges"], "12.05");
  equal(pull(["apples", "oranges"], ["a*"]), ["oranges"], "12.06");
});

// ==========
// edge cases
// ==========

test("13 - against asterisk", () => {
  equal(pull(["a*", "a**", "*******", "*"], ["*"]), [], "13.01");
});

test("14 - against emoji and asterisk", () => {
  equal(
    pull(["🦄", "🦄*", "🦄**", "*🦄", "*******", "*"], ["🦄*"]),
    ["*🦄", "*******", "*"],
    "14.01"
  );
});

test("15", () => {
  not.throws(() => {
    pull(
      ["one", "two", "three"],
      ["one", "three"],
      null // null is fine
    );
  }, "15.01");
  not.throws(() => {
    pull(
      ["one", "two", "three"],
      ["one", "three"],
      {} // empty opts
    );
  }, "15.02");
});

test('16 - 1st arg, "originalInput" is an empty array', () => {
  equal(pull([], "z"), [], "16.01");
  equal(pull([], ""), [], "16.02");
  equal(pull([], ["z"]), [], "16.03");
});

test('17 - 2nd arg, "originalToBeRemoved" is an empty string', () => {
  equal(pull(["apples", "oranges"], ""), ["apples", "oranges"], "17.01");
});

// ========================================
// checks for accidental input arg mutation
// ========================================

test("18 - does not mutate the input args", () => {
  let arr1 = ["a", "b", "c"];
  let arr2 = "c";
  let arr3 = ["c"];
  let unneededResult1 = pull(arr1, arr2);
  ok(unneededResult1, "18.01"); // filler to shut up the linter complaining it's unused

  let unneededResult2 = pull(arr1, arr3);
  ok(unneededResult2, "18.02"); // filler to shut up the linter complaining it's unused
  equal(arr1, ["a", "b", "c"], "18.03");
  equal(arr2, "c", "18.04");
  equal(arr3, ["c"], "18.05");
});

test.run();
