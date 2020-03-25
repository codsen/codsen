const t = require("tap");
const pull = require("../dist/array-pull-all-with-glob.cjs");

// =======
// no glob
// =======

t.test("1.1 - no glob", (t) => {
  t.same(pull(["one", "two", "three"], ["one", "three"]), ["two"], "1.1");
  t.end();
});

t.test("1.2 - won't find", (t) => {
  t.same(
    pull(["one", "two", "three"], ["something"]),
    ["one", "two", "three"],
    "1.2"
  );
  t.end();
});

t.test("1.3 - empty source array", (t) => {
  t.same(pull([], ["one", "three"]), [], "1.3");
  t.end();
});

t.test("1.4 - empty source array", (t) => {
  t.same(pull([], []), [], "1.4");
  t.end();
});

t.test("1.5 - no glob, deletes last remaining thing", (t) => {
  t.same(pull(["one"], ["one"]), [], "1.5");
  t.end();
});

t.test("1.6 - no glob, case sensitive", (t) => {
  t.same(
    pull(["One", "two", "Three"], ["one", "three"]),
    ["One", "two", "Three"],
    "1.6.1 - default"
  );
  t.same(
    pull(["One", "two", "Three"], ["one", "three"], { caseSensitive: false }),
    ["two"],
    "1.6.2 - opts.caseSensitive"
  );
  t.end();
});

// ====
// glob
// ====

t.test("2.1 - glob, normal use", (t) => {
  t.same(
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
    "2.1.1"
  );
  t.same(
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
    "2.1.2"
  );
  t.same(
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
    "2.1.3"
  );
  t.end();
});

t.test("2.2 - asterisk the only input - pulls everything", (t) => {
  t.same(
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
    "2.2.1"
  );
  t.same(
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
    "2.2.2"
  );
  t.end();
});

t.test("2.3 - asterisk in the source array", (t) => {
  t.same(
    pull(
      ["module-*", "module-**", "something-*", "something-**"],
      ["module-*"]
    ),
    ["something-*", "something-**"],
    "2.3"
  );
  t.end();
});

t.test("2.4 - empty arrays as inputs", (t) => {
  t.same(pull([], ["module-*"]), [], "2.4");
  t.end();
});

t.test("2.5 - empty array as second arg", (t) => {
  t.same(
    pull(["module-*", "module-**", "something-*", "something-**"], []),
    ["module-*", "module-**", "something-*", "something-**"],
    "2.5"
  );
  t.end();
});

t.test("2.6 - pulls normal words in various ways", (t) => {
  t.same(pull(["apples", "oranges"], "apples"), ["oranges"], "2.6.1");
  t.same(pull(["apples", "oranges"], ["apples"]), ["oranges"], "2.6.2");
  t.same(pull(["apples", "oranges"], ["apples*"]), ["oranges"], "2.6.3");
  t.same(pull(["apples", "oranges"], "apples*"), ["oranges"], "2.6.4");
  t.same(pull(["apples", "oranges"], "a*"), ["oranges"], "2.6.5");
  t.same(pull(["apples", "oranges"], ["a*"]), ["oranges"], "2.6.6");
  t.end();
});

// ==========
// edge cases
// ==========

t.test("3.2 - missing both inputs - throws", (t) => {
  t.throws(() => {
    pull();
  }, /THROW_ID_01/g);
  t.end();
});

t.test("3.3 - against asterisk", (t) => {
  t.same(pull(["a*", "a**", "*******", "*"], ["*"]), [], "3.3");
  t.throws(() => {
    pull(["a*", "a**", "*******", null, "*"], ["*"]);
  }, /THROW_ID_05/g); // because of null, a non-string element in the array
  t.end();
});

t.test("3.4 - against emoji and asterisk", (t) => {
  t.same(
    pull(["🦄", "🦄*", "🦄**", "*🦄", "*******", "*"], ["🦄*"]),
    ["*🦄", "*******", "*"],
    "3.4"
  );
  t.throws(() => {
    pull(["🦄", "🦄*", "🦄**", "*🦄", "*******", undefined, "*"], ["🦄*"]);
  }, /THROW_ID_05/g); // because of undefined, a non-string element in the array
  t.end();
});

t.test("3.5 - wrong inputs - throws", (t) => {
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

t.test("3.6 - missing one input - throws", (t) => {
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

t.test('3.7 - 1st arg, "originalInput" is an empty array', (t) => {
  t.same(pull([], "z"), [], "3.7.1");
  t.same(pull([], ""), [], "3.7.2");
  t.same(pull([], ["z"]), [], "3.7.3");
  t.end();
});

t.only('3.8 - 2nd arg, "originalToBeRemoved" is an empty string', (t) => {
  t.same(pull(["apples", "oranges"], ""), ["apples", "oranges"], "3.8.1");
  t.end();
});

// ========================================
// checks for accidental input arg mutation
// ========================================

t.test("4.1 - does not mutate the input args", (t) => {
  const arr1 = ["a", "b", "c"];
  const arr2 = "c";
  const arr3 = ["c"];
  const unneededResult1 = pull(arr1, arr2);
  t.pass(unneededResult1); // filler to shut up the linter complaining it's unused

  const unneededResult2 = pull(arr1, arr3);
  t.pass(unneededResult2); // filler to shut up the linter complaining it's unused
  t.same(arr1, ["a", "b", "c"], "4.1.1");
  t.same(arr2, "c", "4.1.2");
  t.same(arr3, ["c"], "4.1.3");

  t.end();
});
