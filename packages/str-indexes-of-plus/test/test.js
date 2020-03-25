const t = require("tap");
const strIndexesOfPlus = require("../dist/str-indexes-of-plus.cjs");

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

t.test("01.01 - throws when there's no input", (t) => {
  t.throws(() => {
    strIndexesOfPlus();
  }, /inputs missing/);
  t.end();
});

t.test("01.02 - throws when the first argument is not string", (t) => {
  t.throws(() => {
    strIndexesOfPlus(1);
  }, /first input argument must be a string/);
  t.end();
});

t.test("01.03 - throws when the second argument is not string", (t) => {
  t.throws(() => {
    strIndexesOfPlus("a", 1);
  }, /second input argument/);
  t.end();
});

t.test("01.04 - throws when the third argument is not natural number", (t) => {
  t.throws(() => {
    strIndexesOfPlus("a", "a", "a");
  }, /third input argument must be a natural number/);
  t.doesNotThrow(() => {
    strIndexesOfPlus("a", "a", "1");
  });
  t.doesNotThrow(() => {
    strIndexesOfPlus("a", "a", 1);
  });
  t.end();
});

// -----------------------------------------------------------------------------
// 02. normal use, no third arg in the input
// -----------------------------------------------------------------------------

t.test("02.01 - finds one char", (t) => {
  t.same(strIndexesOfPlus("a", "a"), [0], "02.01.01");
  t.same(strIndexesOfPlus("ab", "a"), [0], "02.01.02");
  t.same(strIndexesOfPlus("ab", "b"), [1], "02.01.03");
  t.same(strIndexesOfPlus("abc", "a"), [0], "02.01.04");
  t.same(strIndexesOfPlus("abc", "b"), [1], "02.01.05");
  t.same(strIndexesOfPlus("abc", "c"), [2], "02.01.06");
  t.same(strIndexesOfPlus("aaa", "a"), [0, 1, 2], "02.01.07");
  t.same(strIndexesOfPlus("a\u0000a", "a"), [0, 2], "02.01.08");
  t.end();
});

t.test("02.02 - finds one emoji", (t) => {
  t.same(strIndexesOfPlus("🦄", "🦄"), [0], "02.02.01");
  t.same(strIndexesOfPlus("🦄b", "🦄"), [0], "02.02.02");
  t.same(strIndexesOfPlus("a🦄", "🦄"), [1], "02.02.03");
  t.same(strIndexesOfPlus("🦄bc", "🦄"), [0], "02.02.04");
  t.same(strIndexesOfPlus("a🦄c", "🦄"), [1], "02.02.05");
  t.same(strIndexesOfPlus("ab🦄", "🦄"), [2], "02.02.06");
  t.end();
});

t.test("02.03 - does not find a char or emoji", (t) => {
  t.same(strIndexesOfPlus("a", "z"), [], "02.03.01");
  t.same(strIndexesOfPlus("abcdef", "z"), [], "02.03.02");
  t.same(strIndexesOfPlus("🦄", "z"), [], "02.03.03");
  t.same(strIndexesOfPlus("a", "🦄"), [], "02.03.04");
  t.same(strIndexesOfPlus("abcd🦄f", "z"), [], "02.03.05");
  t.end();
});

t.test("02.04 - finds multiple consecutive", (t) => {
  t.same(strIndexesOfPlus("abcabc", "abc"), [0, 3], "02.04.01");
  t.same(strIndexesOfPlus("🦄🐴🐎🦄🐴🐎", "🦄🐴🐎"), [0, 3], "02.04.02");
  t.end();
});

t.test("02.05 - finds multiple with space in between, first char hit", (t) => {
  t.same(strIndexesOfPlus("abczabc", "abc"), [0, 4], "02.05.01");
  t.same(strIndexesOfPlus("🦄🐴🐎z🦄🐴🐎", "🦄🐴🐎"), [0, 4], "02.05.02");
  t.end();
});

t.test(
  "02.06 - finds multiple with space in between, first char is not hit",
  (t) => {
    t.same(strIndexesOfPlus("zabczabc", "abc"), [1, 5], "02.06.01");
    t.same(strIndexesOfPlus("zabczabcyyyyy", "abc"), [1, 5], "02.06.02");
    t.same(strIndexesOfPlus("z🦄🐴🐎z🦄🐴🐎", "🦄🐴🐎"), [1, 5], "02.06.03");
    t.same(
      strIndexesOfPlus("z🦄🐴🐎z🦄🐴🐎yyyyy", "🦄🐴🐎"),
      [1, 5],
      "02.06.04"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 03. padding offset
// -----------------------------------------------------------------------------

t.test("03.01 - finds multiple consecutive, text, offset", (t) => {
  t.same(strIndexesOfPlus("abcabc", "abc", 0), [0, 3], "03.01.01");
  t.same(strIndexesOfPlus("abcabc", "abc", "0"), [0, 3], "03.01.02");
  t.same(strIndexesOfPlus("abcabc", "abc", 1), [3], "03.01.03");
  t.same(strIndexesOfPlus("abcabc", "abc", "1"), [3], "03.01.04");
  t.same(strIndexesOfPlus("abcabc", "abc", 999), [], "03.01.05");
  t.same(strIndexesOfPlus("abcabc", "abc", "999"), [], "03.01.06");
  t.end();
});

t.test("03.02 - finds multiple consecutive, emoji, offset", (t) => {
  t.same(strIndexesOfPlus("🦄🐴🐎🦄🐴🐎", "🦄🐴🐎", 0), [0, 3], "03.02.01");
  t.same(strIndexesOfPlus("🦄🐴🐎🦄🐴🐎", "🦄🐴🐎", "0"), [0, 3], "03.02.02");
  t.same(strIndexesOfPlus("🦄🐴🐎🦄🐴🐎", "🦄🐴🐎", 1), [3], "03.02.03");
  t.same(strIndexesOfPlus("🦄🐴🐎🦄🐴🐎", "🦄🐴🐎", "1"), [3], "03.02.04");
  t.same(strIndexesOfPlus("🦄🐴🐎🦄🐴🐎", "🦄🐴🐎", 999), [], "03.02.05");
  t.same(strIndexesOfPlus("🦄🐴🐎🦄🐴🐎", "🦄🐴🐎", "999"), [], "03.02.06");
  t.end();
});

t.test(
  "03.03 - finds multiple with space in between, first char hit, offset",
  (t) => {
    t.same(strIndexesOfPlus("abczabc", "abc", 0), [0, 4], "03.03.01");
    t.same(strIndexesOfPlus("abczabc", "abc", 3), [4], "03.03.02");
    t.same(strIndexesOfPlus("abczabc", "abc", 4), [4], "03.03.03");
    t.same(strIndexesOfPlus("abczabc", "abc", 5), [], "03.03.04");
    t.same(strIndexesOfPlus("🦄🐴🐎z🦄🐴🐎", "🦄🐴🐎", 0), [0, 4], "03.03.05");
    t.same(strIndexesOfPlus("🦄🐴🐎z🦄🐴🐎", "🦄🐴🐎", 3), [4], "03.03.06");
    t.same(strIndexesOfPlus("🦄🐴🐎z🦄🐴🐎", "🦄🐴🐎", 4), [4], "03.03.07");
    t.same(strIndexesOfPlus("🦄🐴🐎z🦄🐴🐎", "🦄🐴🐎", 5), [], "03.03.08");
    t.end();
  }
);

t.test(
  "03.04 - finds multiple with space in between, first char is not hit, offset",
  (t) => {
    t.same(strIndexesOfPlus("zabczabc", "abc", 0), [1, 5], "03.04.01");
    t.same(strIndexesOfPlus("zabczabc", "abc", "0"), [1, 5], "03.04.02");
    t.same(strIndexesOfPlus("zabczabc", "abc", 1), [1, 5], "03.04.03");
    t.same(strIndexesOfPlus("zabczabc", "abc", "1"), [1, 5], "03.04.04");
    t.same(strIndexesOfPlus("zabczabc", "abc", 2), [5], "03.04.05");
    t.same(strIndexesOfPlus("zabczabc", "abc", "2"), [5], "03.04.06");
    t.same(strIndexesOfPlus("babababa", "ab"), [1, 3, 5], "03.04.07");
    t.same(strIndexesOfPlus("babababa", "ab", 2), [3, 5], "03.04.08");
    t.same(strIndexesOfPlus("babababa", "ab", "2"), [3, 5], "03.04.09");
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 04. real text with linebreaks etc
// -----------------------------------------------------------------------------

t.test("04.01 - finds in real text, no offset", (t) => {
  const text =
    "This is cheeky sentence with a cheeky\nlinebreaks,\ttabs and some <code>HTML</code> tags. Also there's a cheeky emoji 🙊 and cheeky Unicode characters: \u0000\u0001. That's a very cheeky test sentence.";
  t.same(strIndexesOfPlus(text, "cheeky"), [8, 31, 103, 122, 167], "04.01");
  t.same(text.charAt(8), "c");
  t.same(text.charAt(31), "c");
  t.same(text.charAt(103), "c");
  // following two are offset by one, because emoji pushed them by one:
  t.same(text.charAt(123), "c");
  t.same(text.charAt(168), "c");
  t.end();
});
