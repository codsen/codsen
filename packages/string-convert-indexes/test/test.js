const t = require("tap");
const {
  nativeToUnicode,
  unicodeToNative,
} = require("../dist/string-convert-indexes.cjs");

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

t.test("01.01 - empty string", (t) => {
  t.throws(() => {
    unicodeToNative("", 0);
  }, /THROW_ID_02/g);
  t.throws(() => {
    nativeToUnicode("", 0);
  }, /THROW_ID_02/g);
  t.end();
});

t.test("01.02 - indexes outside of the reference string", (t) => {
  // Case: The first character outside of a string.
  // For example, if you have a string "a".
  // If you described its contents as a String.slice() range, that would be [0, 1].
  // Observe that we get index #1, although it does not exist, we have only "a"
  // at index #0. Now when converting, this #1 has to be supported. And it's fine,
  // we can convert its index perfectly fine because all we need is only lengths
  // of the characters that PRECEDE it. Which we have.

  t.same(nativeToUnicode("a", 1), 1, "01.02.01");
  t.same(unicodeToNative("a", 1), 1, "01.02.02");
  t.same(nativeToUnicode("a", "1"), "1", "01.02.03");
  t.same(unicodeToNative("a", "1"), "1", "01.02.04");
  t.same(nativeToUnicode("a", ["1"]), ["1"], "01.02.05");
  t.same(unicodeToNative("a", ["1"]), ["1"], "01.02.06");
  // now astral:
  t.same(nativeToUnicode("\uD834\uDF06", 2), 1, "01.02.07");
  t.same(unicodeToNative("\uD834\uDF06", 1), 2, "01.02.08");

  // opts.throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString = ON
  t.throws(() => {
    nativeToUnicode("a", 2);
  }, /THROW_ID_05/g); // 01.02.09
  t.throws(() => {
    unicodeToNative("a", 2);
  }, /THROW_ID_06/g); // 01.02.10
  t.throws(() => {
    nativeToUnicode("a", "2");
  }, /THROW_ID_05/g); // 01.02.11
  t.throws(() => {
    unicodeToNative("a", "2");
  }, /THROW_ID_06/g); // 01.02.12
  // opts.throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString = OFF
  t.same(
    nativeToUnicode("a", 2, {
      throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: false,
    }),
    2,
    "01.02.13"
  );
  t.same(
    nativeToUnicode("a", "2", {
      throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: false,
    }),
    "2",
    "01.02.14"
  );
  t.same(
    unicodeToNative("a", 2, {
      throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: false,
    }),
    2,
    "01.02.15"
  );
  t.same(
    unicodeToNative("a", "2", {
      throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: false,
    }),
    "2",
    "01.02.16"
  );
  t.end();
});

t.test("01.03 - negative indexes are ignored", (t) => {
  t.same(nativeToUnicode("a", "-1"), "-1", "01.03.01");
  t.same(unicodeToNative("a", "-1"), "-1", "01.03.02");
  t.same(nativeToUnicode("a", -1), -1, "01.03.03");
  t.same(unicodeToNative("a", -1), -1, "01.03.04");
  t.end();
});

t.test("01.04 - opts is not a plain object", (t) => {
  t.throws(() => {
    nativeToUnicode("a", 1, 1);
  }, /THROW_ID_03/g);
  t.throws(() => {
    unicodeToNative("a", 1, 1);
  }, /THROW_ID_03/g);
  t.end();
});

t.test("01.05 - missing input args", (t) => {
  t.throws(() => {
    nativeToUnicode();
  }, /THROW_ID_01/g);
  t.throws(() => {
    unicodeToNative();
  }, /THROW_ID_01/g);
  t.throws(() => {
    nativeToUnicode("a");
  }, /THROW_ID_01/g);
  t.throws(() => {
    unicodeToNative("a");
  }, /THROW_ID_01/g);
  t.end();
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

t.test("02.01 - two astral characters offsetting the rest", (t) => {
  t.same(
    nativeToUnicode("\uD834\uDF06aa", [0, 1, 2, 3]),
    [0, 0, 1, 2],
    "02.01.01 - all unique"
  );
  t.same(
    nativeToUnicode("\uD834\uDF06aa", ["0", "1", "2", "3"]),
    ["0", "0", "1", "2"],
    "02.01.01.02"
  );

  t.same(
    nativeToUnicode("\uD834\uDF06aa", [0, 2, 0, 1, 2, 3]),
    [0, 1, 0, 0, 1, 2],
    "02.01.02 - with dupes"
  );
  t.same(
    nativeToUnicode("\uD834\uDF06aa", ["0", "2", "0", "1", "2", "3"]),
    ["0", "1", "0", "0", "1", "2"],
    "02.01.02.02"
  );

  t.same(
    unicodeToNative("\uD834\uDF06aa", [0, 1, 2]),
    [0, 2, 3],
    "02.01.03.01 - all unique, sorted"
  );
  t.same(
    unicodeToNative("\uD834\uDF06aa", ["0", "1", "2"]),
    ["0", "2", "3"],
    "02.01.03.02"
  );

  t.same(
    unicodeToNative("\uD834\uDF06aa", [1, 0, 2]),
    [2, 0, 3],
    "02.01.04.01 - all unique, mixed up"
  );
  t.same(
    unicodeToNative("\uD834\uDF06aa", ["1", "0", "2"]),
    ["2", "0", "3"],
    "02.01.04.02"
  );
  t.same(
    unicodeToNative("\uD834\uDF06aa", ["3", "0"]),
    ["4", "0"],
    "02.01.04.03"
  );

  t.throws(() => {
    unicodeToNative("\uD834\uDF06aa", [1, 0, 2, 3, 4]);
  });
  t.throws(() => {
    unicodeToNative("\uD834\uDF06aa", ["1", "0", "2", "3", "4"]);
  });

  // If you want to turn off the requirement that all indexes were covered by
  // the reference string characters, you can do it. However, results might become
  // dodgy. Observe:
  t.same(
    unicodeToNative("\uD834\uDF06aa", [1, 0, 2, 3, 4], {
      throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: false,
    }),
    [2, 0, 3, 4, 4], // <----- this second "4" is just left as it was, which is weird now
    "02.01.06.01 - you don't want such case, notice how fourth index in source, 3 gets left untouched now"
  );
  t.same(
    unicodeToNative("\uD834\uDF06aa", ["1", "0", "2", "3", "4"], {
      throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: false,
    }),
    ["2", "0", "3", "4", "4"], // <----- this second "4" is weird now
    "02.01.06.02"
  );
  t.end();
});

t.test(
  "02.02 - a stray astral surrogate without second counterpart counts as symbol",
  (t) => {
    t.same(
      nativeToUnicode("\uD834\uDF06a\uDF06a", [0, 1, 2, 3, 4]),
      [0, 0, 1, 2, 3],
      "02.02"
    );
    t.end();
  }
);

t.test("02.03 - one letter string", (t) => {
  t.same(nativeToUnicode("a", 0), 0, "02.03.01");
  t.same(unicodeToNative("a", 0), 0, "02.03.02");
  t.end();
});

t.test("02.04 - single astral symbol", (t) => {
  t.same(nativeToUnicode("\uD834\uDF06", 0), 0, "02.04.01");
  t.same(unicodeToNative("\uD834\uDF06", 0), 0, "02.04.02");
  t.same(nativeToUnicode("\uD834\uDF06", 1), 0, "02.04.03");
  t.same(nativeToUnicode("\uD834\uDF06", 2), 1, "02.04.03");
  t.throws(() => {
    nativeToUnicode("\uD834\uDF06", 3);
  });
  t.same(unicodeToNative("\uD834\uDF06", 1), 2, "02.04.02");
  t.throws(() => {
    unicodeToNative("\uD834\uDF06", 2);
  });
  t.end();
});

t.test("02.05 - multiple consecutive astral symbols", (t) => {
  t.same(nativeToUnicode("\uD834\uDF06\uD834\uDF06", 0), 0, "02.05.01");
  t.same(unicodeToNative("\uD834\uDF06\uD834\uDF06", 0), 0, "02.05.02");
  t.same(nativeToUnicode("\uD834\uDF06\uD834\uDF06", 1), 0, "02.05.03");
  t.same(unicodeToNative("\uD834\uDF06\uD834\uDF06", 1), 2, "02.05.04");
  t.end();
});
