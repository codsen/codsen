// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

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
    "02.01",
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
    "06.01",
  );
  equal(
    pull(["One", "two", "Three"], ["one", "three"], { caseSensitive: false }),
    ["two"],
    "06.02",
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
      ["module-*", "something else", "element*"],
    ),
    ["only this left"],
    "07.01",
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
    ),
    ["Module-1", "only this left"],
    "07.02",
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
      { caseSensitive: false },
    ),
    ["only this left"],
    "07.03",
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
      ["*"], // <------ array
    ),
    [],
    "08.01",
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
      "*", // <---- string
    ),
    [],
    "08.02",
  );
});

test("09 - asterisk in the source array", () => {
  equal(
    pull(
      ["module-*", "module-**", "something-*", "something-**"],
      ["module-*"],
    ),
    ["something-*", "something-**"],
    "09.01",
  );
});

test("10 - empty arrays as inputs", () => {
  equal(pull([], ["module-*"]), [], "10.01");
});

test("11 - empty array as second arg", () => {
  equal(
    pull(["module-*", "module-**", "something-*", "something-**"], []),
    ["module-*", "module-**", "something-*", "something-**"],
    "11.01",
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
    "14.01",
  );
});

test("15", () => {
  not.throws(() => {
    pull(
      ["one", "two", "three"],
      ["one", "three"],
      null, // null is fine
    );
  }, "15.01");
  not.throws(() => {
    pull(
      ["one", "two", "three"],
      ["one", "three"],
      {}, // empty opts
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
  const arr1 = ["a", "b", "c"];
  const arr2 = "c";
  const arr3 = ["c"];
  const unneededResult1 = pull(arr1, arr2);
  ok(unneededResult1, "18.01"); // filler to shut up the linter complaining it's unused

  const unneededResult2 = pull(arr1, arr3);
  ok(unneededResult2, "18.02"); // filler to shut up the linter complaining it's unused
  equal(arr1, ["a", "b", "c"], "18.01");
  equal(arr2, "c", "18.02");
  equal(arr3, ["c"], "18.03");
});

test("19 - resolves the case-sensitive option", () => {
  equal(pull(["Alpha"], "alpha"), ["Alpha"], "19.01");
  equal(pull(["Alpha"], "alpha", {}), ["Alpha"], "19.02");
  equal(
    pull(["Alpha"], "alpha", { caseSensitive: undefined }),
    ["Alpha"],
    "19.03",
  );
  equal(
    pull(["Alpha"], "alpha", { caseSensitive: false }),
    [],
    "19.04",
  );
});

test("20 - removal-pattern grammar", () => {
  equal(
    pull(["file.js", "prefix-file.js"], "file.js"),
    ["prefix-file.js"],
    "20.01",
  );
  equal(
    pull(
      ["src/main.js", "src/nested/main.js", "src/main.ts"],
      "src/*.js",
    ),
    ["src/main.ts"],
    "20.02",
  );
  equal(
    pull(["top\nbottom", "top-middle-bottom"], "top*bottom"),
    [],
    "20.03",
  );
  equal(pull(["abc", "ac"], "a***c"), [], "20.04");
  equal(
    pull(
      ["file?.js", "file[1].js", "file{1}.js", "file@(1).js", "file1.js"],
      ["file?.js", "file[1].js", "file{1}.js", "file@(1).js"],
    ),
    ["file1.js"],
    "20.05",
  );
  equal(pull(["file*", "file1"], String.raw`file\*`), ["file1"], "20.06");
  equal(
    pull(["!foo", "foo", "bar"], String.raw`\!foo`),
    ["foo", "bar"],
    "20.07",
  );
  equal(pull(["foo", "bar"], "!foo"), ["foo"], "20.08");
  equal(
    pull(["keep.js", "main.js", "notes.txt"], ["*.js", "!keep.js"]),
    [],
    "20.09",
  );
  equal(pull([String.raw`a\b`], String.raw`a\\b`), [], "20.10");
  equal(
    pull(["Ärger", "ärger", "ß", "SS", "𐐨", "𐐀"], ["ärger", "SS", "𐐀"], {
      caseSensitive: false,
    }),
    ["ß", "𐐨"],
    "20.11",
  );
});

test("21 - ignores empty removal patterns", () => {
  const source = ["", "a", "a", "b"];
  const emptyPatterns = [""];
  const result = pull(source, emptyPatterns);

  equal(pull(["", "a"], ""), ["", "a"], "21.01");
  equal(result, source, "21.02");
  is.not(result, source, "21.03");
  equal(pull(source, ["", "a", ""]), ["", "b"], "21.04");
  equal(pull(["", "a", "b"], ["", "", "b", "b"]), ["", "a"], "21.05");
  equal(source, ["", "a", "a", "b"], "21.06");
  equal(emptyPatterns, [""], "21.07");
});

test("22 - accepts frozen arrays and returns a fresh array", () => {
  const emptySource = Object.freeze([]);
  const source = Object.freeze(["a", "b"]);
  const noMatchPatterns = Object.freeze(["z"]);
  const partialPatterns = Object.freeze(["a"]);
  const fullPatterns = Object.freeze(["*"]);
  const emptyResult = pull(emptySource, noMatchPatterns);
  const noMatchResult = pull(source, noMatchPatterns);

  equal(emptyResult, [], "22.01");
  is.not(emptyResult, emptySource, "22.02");
  equal(noMatchResult, ["a", "b"], "22.03");
  is.not(noMatchResult, source, "22.04");
  equal(pull(source, partialPatterns), ["b"], "22.05");
  equal(pull(source, fullPatterns), [], "22.06");
  equal(source, ["a", "b"], "22.07");
  equal(partialPatterns, ["a"], "22.08");
});

test.run();
