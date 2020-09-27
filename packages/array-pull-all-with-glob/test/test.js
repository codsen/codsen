import tap from "tap";
import pull from "../dist/array-pull-all-with-glob.esm";

// =======
// no glob
// =======

tap.test("01 - no glob", (t) => {
  t.strictSame(pull(["one", "two", "three"], ["one", "three"]), ["two"], "01");
  t.end();
});

tap.test("02 - won't find", (t) => {
  t.strictSame(
    pull(["one", "two", "three"], ["something"]),
    ["one", "two", "three"],
    "02"
  );
  t.end();
});

tap.test("03 - empty source array", (t) => {
  t.strictSame(pull([], ["one", "three"]), [], "03");
  t.end();
});

tap.test("04 - empty source array", (t) => {
  t.strictSame(pull([], []), [], "04");
  t.end();
});

tap.test("05 - no glob, deletes last remaining thing", (t) => {
  t.strictSame(pull(["one"], ["one"]), [], "05");
  t.end();
});

tap.test("06 - no glob, case sensitive", (t) => {
  t.strictSame(
    pull(["One", "two", "Three"], ["one", "three"]),
    ["One", "two", "Three"],
    "06.01 - default"
  );
  t.strictSame(
    pull(["One", "two", "Three"], ["one", "three"], { caseSensitive: false }),
    ["two"],
    "06.02 - opts.caseSensitive"
  );
  t.end();
});

// ====
// glob
// ====

tap.test("07 - glob, normal use", (t) => {
  t.strictSame(
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
  t.strictSame(
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
  t.strictSame(
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
  t.end();
});

tap.test("08 - asterisk the only input - pulls everything", (t) => {
  t.strictSame(
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
  t.strictSame(
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
  t.end();
});

tap.test("09 - asterisk in the source array", (t) => {
  t.strictSame(
    pull(
      ["module-*", "module-**", "something-*", "something-**"],
      ["module-*"]
    ),
    ["something-*", "something-**"],
    "09"
  );
  t.end();
});

tap.test("10 - empty arrays as inputs", (t) => {
  t.strictSame(pull([], ["module-*"]), [], "10");
  t.end();
});

tap.test("11 - empty array as second arg", (t) => {
  t.strictSame(
    pull(["module-*", "module-**", "something-*", "something-**"], []),
    ["module-*", "module-**", "something-*", "something-**"],
    "11"
  );
  t.end();
});

tap.test("12 - pulls normal words in various ways", (t) => {
  t.strictSame(pull(["apples", "oranges"], "apples"), ["oranges"], "12.01");
  t.strictSame(pull(["apples", "oranges"], ["apples"]), ["oranges"], "12.02");
  t.strictSame(pull(["apples", "oranges"], ["apples*"]), ["oranges"], "12.03");
  t.strictSame(pull(["apples", "oranges"], "apples*"), ["oranges"], "12.04");
  t.strictSame(pull(["apples", "oranges"], "a*"), ["oranges"], "12.05");
  t.strictSame(pull(["apples", "oranges"], ["a*"]), ["oranges"], "12.06");
  t.end();
});

// ==========
// edge cases
// ==========

tap.test("13 - missing both inputs - throws", (t) => {
  t.throws(() => {
    pull();
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("14 - against asterisk", (t) => {
  t.strictSame(pull(["a*", "a**", "*******", "*"], ["*"]), [], "14.01");
  t.throws(() => {
    pull(["a*", "a**", "*******", null, "*"], ["*"]);
  }, /THROW_ID_05/g); // because of null, a non-string element in the array
  t.end();
});

tap.test("15 - against emoji and asterisk", (t) => {
  t.strictSame(
    pull(["🦄", "🦄*", "🦄**", "*🦄", "*******", "*"], ["🦄*"]),
    ["*🦄", "*******", "*"],
    "15.01"
  );
  t.throws(() => {
    pull(["🦄", "🦄*", "🦄**", "*🦄", "*******", undefined, "*"], ["🦄*"]);
  }, /THROW_ID_05/g); // because of undefined, a non-string element in the array
  t.end();
});

tap.test("16 - wrong inputs - throws", (t) => {
  t.throws(() => {
    pull(1, 1);
  }, /THROW_ID_01/g);
  t.throws(() => {
    pull(1, ["a"]);
  }, /THROW_ID_01/g);
  t.throws(() => {
    pull(["a"], 1);
  }, /THROW_ID_04/g);
  t.throws(() => {
    pull(["a", 1], ["b"]);
  }, /THROW_ID_05/g);
  t.throws(() => {
    pull(["a", 1], ["b", 1]);
  }, /THROW_ID_05/g);
  t.throws(() => {
    pull(["a", "b"], ["b", 1, "c"]);
  }, /THROW_ID_06/g);

  t.end();
});

tap.test("17 - missing one input - throws", (t) => {
  t.throws(() => {
    pull(
      ["one", "two", "three"],
      ["one", "three"],
      1 // not a plain obj
    );
  }, /THROW_ID_07/g);
  t.throws(() => {
    pull(
      ["one", "two", "three"],
      ["one", "three"],
      true // not a plain obj
    );
  }, /THROW_ID_07/g);
  t.throws(() => {
    pull(
      ["one", "two", "three"],
      ["one", "three"],
      [] // array - sneaky!
    );
  }, /THROW_ID_07/g);
  t.doesNotThrow(() => {
    pull(
      ["one", "two", "three"],
      ["one", "three"],
      null // null is fine
    );
  }, /THROW_ID_01/g);
  t.doesNotThrow(() => {
    pull(
      ["one", "two", "three"],
      ["one", "three"],
      {} // empty opts
    );
  }, /THROW_ID_01/g);

  t.end();
});

tap.test('18 - 1st arg, "originalInput" is an empty array', (t) => {
  t.strictSame(pull([], "z"), [], "18.01");
  t.strictSame(pull([], ""), [], "18.02");
  t.strictSame(pull([], ["z"]), [], "18.03");
  t.end();
});

tap.test('19 - 2nd arg, "originalToBeRemoved" is an empty string', (t) => {
  t.strictSame(pull(["apples", "oranges"], ""), ["apples", "oranges"], "19");
  t.end();
});

// ========================================
// checks for accidental input arg mutation
// ========================================

tap.test("20 - does not mutate the input args", (t) => {
  const arr1 = ["a", "b", "c"];
  const arr2 = "c";
  const arr3 = ["c"];
  const unneededResult1 = pull(arr1, arr2);
  t.pass(unneededResult1); // filler to shut up the linter complaining it's unused

  const unneededResult2 = pull(arr1, arr3);
  t.pass(unneededResult2); // filler to shut up the linter complaining it's unused
  t.strictSame(arr1, ["a", "b", "c"], "20.01");
  t.strictSame(arr2, "c", "20.02");
  t.strictSame(arr3, ["c"], "20.03");

  t.end();
});
