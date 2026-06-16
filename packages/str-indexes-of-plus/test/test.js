// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { strIndexesOfPlus } from "../dist/str-indexes-of-plus.esm.js";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01 - throws when the first argument is not string", () => {
  throws(
    () => {
      strIndexesOfPlus(1);
    },
    /first input argument must be a string/,
    "01.01",
  );
});

test("02 - throws when the second argument is not string", () => {
  throws(
    () => {
      strIndexesOfPlus("a", 1);
    },
    /second input argument/,
    "02.01",
  );
});

test("03 - throws when the third argument is not natural number", () => {
  throws(
    () => {
      strIndexesOfPlus("a", "a", "a");
    },
    /third input argument must be a natural number/,
    "03.01",
  );
  not.throws(() => {
    strIndexesOfPlus("a", "a", "1");
  }, "03.02");
  not.throws(() => {
    strIndexesOfPlus("a", "a", 1);
  }, "03.03");
  throws(
    () => {
      strIndexesOfPlus("a", "a", -1);
    },
    /THROW_ID_03/,
    "03.04",
  );
  throws(
    () => {
      strIndexesOfPlus("a", "a", 1.5);
    },
    /THROW_ID_03/,
    "03.05",
  );
  throws(
    () => {
      strIndexesOfPlus("a", "a", Infinity);
    },
    /THROW_ID_03/,
    "03.06",
  );
});

// -----------------------------------------------------------------------------
// 02. normal use, no third arg in the input
// -----------------------------------------------------------------------------

test("04 - finds one char", () => {
  equal(strIndexesOfPlus("a", "a"), [0], "04.01");
  equal(strIndexesOfPlus("ab", "a"), [0], "04.02");
  equal(strIndexesOfPlus("ab", "b"), [1], "04.03");
  equal(strIndexesOfPlus("abc", "a"), [0], "04.04");
  equal(strIndexesOfPlus("abc", "b"), [1], "04.05");
  equal(strIndexesOfPlus("abc", "c"), [2], "04.06");
  equal(strIndexesOfPlus("aaa", "a"), [0, 1, 2], "04.07");
  equal(strIndexesOfPlus("a\u0000a", "a"), [0, 2], "04.08");
});

test("05 - finds one emoji", () => {
  equal(strIndexesOfPlus("🦄", "🦄"), [0], "05.01");
  equal(strIndexesOfPlus("🦄b", "🦄"), [0], "05.02");
  equal(strIndexesOfPlus("a🦄", "🦄"), [1], "05.03");
  equal(strIndexesOfPlus("🦄bc", "🦄"), [0], "05.04");
  equal(strIndexesOfPlus("a🦄c", "🦄"), [1], "05.05");
  equal(strIndexesOfPlus("ab🦄", "🦄"), [2], "05.06");
});

test("06 - does not find a char or emoji", () => {
  equal(strIndexesOfPlus("a", "z"), [], "06.01");
  equal(strIndexesOfPlus("abcdef", "z"), [], "06.02");
  equal(strIndexesOfPlus("🦄", "z"), [], "06.03");
  equal(strIndexesOfPlus("a", "🦄"), [], "06.04");
  equal(strIndexesOfPlus("abcd🦄f", "z"), [], "06.05");
});

test("07 - finds multiple consecutive", () => {
  equal(strIndexesOfPlus("abcabc", "abc"), [0, 3], "07.01");
  equal(strIndexesOfPlus("🦄🐴🐎🦄🐴🐎", "🦄🐴🐎"), [0, 3], "07.02");
});

test("08 - finds multiple with space in between, first char hit", () => {
  equal(strIndexesOfPlus("abczabc", "abc"), [0, 4], "08.01");
  equal(strIndexesOfPlus("🦄🐴🐎z🦄🐴🐎", "🦄🐴🐎"), [0, 4], "08.02");
});

test("09 - finds multiple with space in between, first char is not hit", () => {
  equal(strIndexesOfPlus("zabczabc", "abc"), [1, 5], "09.01");
  equal(strIndexesOfPlus("zabczabcyyyyy", "abc"), [1, 5], "09.02");
  equal(strIndexesOfPlus("z🦄🐴🐎z🦄🐴🐎", "🦄🐴🐎"), [1, 5], "09.03");
  equal(strIndexesOfPlus("z🦄🐴🐎z🦄🐴🐎yyyyy", "🦄🐴🐎"), [1, 5], "09.04");
});

// -----------------------------------------------------------------------------
// 03. padding offset
// -----------------------------------------------------------------------------

test("10 - finds multiple consecutive, text, offset", () => {
  equal(strIndexesOfPlus("abcabc", "abc", 0), [0, 3], "10.01");
  equal(strIndexesOfPlus("abcabc", "abc", "0"), [0, 3], "10.02");
  equal(strIndexesOfPlus("abcabc", "abc", 1), [3], "10.03");
  equal(strIndexesOfPlus("abcabc", "abc", "1"), [3], "10.04");
  equal(strIndexesOfPlus("abcabc", "abc", 999), [], "10.05");
  equal(strIndexesOfPlus("abcabc", "abc", "999"), [], "10.06");
});

test("11 - finds multiple consecutive, emoji, offset", () => {
  equal(strIndexesOfPlus("🦄🐴🐎🦄🐴🐎", "🦄🐴🐎", 0), [0, 3], "11.01");
  equal(strIndexesOfPlus("🦄🐴🐎🦄🐴🐎", "🦄🐴🐎", "0"), [0, 3], "11.02");
  equal(strIndexesOfPlus("🦄🐴🐎🦄🐴🐎", "🦄🐴🐎", 1), [3], "11.03");
  equal(strIndexesOfPlus("🦄🐴🐎🦄🐴🐎", "🦄🐴🐎", "1"), [3], "11.04");
  equal(strIndexesOfPlus("🦄🐴🐎🦄🐴🐎", "🦄🐴🐎", 999), [], "11.05");
  equal(strIndexesOfPlus("🦄🐴🐎🦄🐴🐎", "🦄🐴🐎", "999"), [], "11.06");
});

test("12 - finds multiple with space in between, first char hit, offset", () => {
  equal(strIndexesOfPlus("abczabc", "abc", 0), [0, 4], "12.01");
  equal(strIndexesOfPlus("abczabc", "abc", 3), [4], "12.02");
  equal(strIndexesOfPlus("abczabc", "abc", 4), [4], "12.03");
  equal(strIndexesOfPlus("abczabc", "abc", 5), [], "12.04");
  equal(strIndexesOfPlus("🦄🐴🐎z🦄🐴🐎", "🦄🐴🐎", 0), [0, 4], "12.05");
  equal(strIndexesOfPlus("🦄🐴🐎z🦄🐴🐎", "🦄🐴🐎", 3), [4], "12.06");
  equal(strIndexesOfPlus("🦄🐴🐎z🦄🐴🐎", "🦄🐴🐎", 4), [4], "12.07");
  equal(strIndexesOfPlus("🦄🐴🐎z🦄🐴🐎", "🦄🐴🐎", 5), [], "12.08");
});

test("13 - finds multiple with space in between, first char is not hit, offset", () => {
  equal(strIndexesOfPlus("zabczabc", "abc", 0), [1, 5], "13.01");
  equal(strIndexesOfPlus("zabczabc", "abc", "0"), [1, 5], "13.02");
  equal(strIndexesOfPlus("zabczabc", "abc", 1), [1, 5], "13.03");
  equal(strIndexesOfPlus("zabczabc", "abc", "1"), [1, 5], "13.04");
  equal(strIndexesOfPlus("zabczabc", "abc", 2), [5], "13.05");
  equal(strIndexesOfPlus("zabczabc", "abc", "2"), [5], "13.06");
  equal(strIndexesOfPlus("babababa", "ab"), [1, 3, 5], "13.07");
  equal(strIndexesOfPlus("babababa", "ab", 2), [3, 5], "13.08");
  equal(strIndexesOfPlus("babababa", "ab", "2"), [3, 5], "13.09");
});

// -----------------------------------------------------------------------------
// 04. real text with linebreaks etc
// -----------------------------------------------------------------------------

test("14 - finds in real text, no offset", () => {
  let text =
    "This is cheeky sentence with a cheeky\nlinebreaks,\ttabs and some <code>HTML</code> tags. Also there's a cheeky emoji 🙊 and cheeky Unicode characters: \u0000\u0001. That's a very cheeky test sentence.";
  equal(strIndexesOfPlus(text, "cheeky"), [8, 31, 103, 122, 167], "14.01");
  equal(text.charAt(8), "c", "14.02");
  equal(text.charAt(31), "c", "14.03");
  equal(text.charAt(103), "c", "14.04");
  // following two are offset by one, because emoji pushed them by one:
  equal(text.charAt(123), "c", "14.05");
  equal(text.charAt(168), "c", "14.06");
});

test("15 - finds overlapping matches", () => {
  equal(strIndexesOfPlus("aaa", "aa"), [0, 1], "15.01");
  equal(strIndexesOfPlus("aaab", "aab"), [1], "15.02");
  equal(strIndexesOfPlus("🦄🦄🦄", "🦄🦄"), [0, 1], "15.03");
});

test.run();
