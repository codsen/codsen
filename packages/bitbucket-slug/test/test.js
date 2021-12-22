import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { bSlug as s } from "../dist/bitbucket-slug.esm.js";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01 - empty input", () => {
  equal(s(), "", "01");
});
test("02 - number input", () => {
  equal(s(1), "", "02");
});
test("03 - null input", () => {
  equal(s(null), "", "03");
});
test("04 - undefined input", () => {
  equal(s(undefined), "", "04");
});
test("05 - Boolean input", () => {
  equal(s(true), "", "05");
});

// 02. No punctuation in the end
// -----------------------------------------------------------------------------

test("06 - h1 slug", () => {
  equal(
    s("# Let's backwards-engineer BitBucket anchor link slug algorithm"),
    "markdown-header-lets-backwards-engineer-bitbucket-anchor-link-slug-algorithm",
    "06"
  );
});

test("07 - There's a single word above, first capital", () => {
  equal(s("## Word"), "markdown-header-word", "07");
});

test("08 - There are two words above, first capital", () => {
  equal(s("## Two words"), "markdown-header-two-words", "08");
});

test("09 - Three words, first capital", () => {
  equal(s("## Three words here"), "markdown-header-three-words-here", "09");
});

test("10 - There's a single word above, first lowercase", () => {
  equal(s("## word"), "markdown-header-word", "10");
});

test("11 - There are two words above, first lowercase", () => {
  equal(s("## two words"), "markdown-header-two-words", "11");
});

test("12 - Three words, first lowercase", () => {
  equal(s("## three words here"), "markdown-header-three-words-here", "12");
});

// 03. Ends with full stop
// -----------------------------------------------------------------------------

test("13 - There's a single word above, first capital, ends with full stop", () => {
  equal(s("## Word."), "markdown-header-word", "13");
});

test("14 - There are two words above, first capital, ends with full stop", () => {
  equal(s("## Two words."), "markdown-header-two-words", "14");
});

test("15 - Three words, first capital, ends with full stop", () => {
  equal(s("## Three words here."), "markdown-header-three-words-here", "15");
});

test("16 - There's a single word above, first lowercase, ends with full stop", () => {
  equal(s("## word."), "markdown-header-word", "16");
});

test("17 - There are two words above, first lowercase, ends with full stop", () => {
  equal(s("## two words."), "markdown-header-two-words", "17");
});

test("18 - Three words, first lowercase, ends with full stop", () => {
  equal(s("## three words here."), "markdown-header-three-words-here", "18");
});

// 04. Question mark
// -----------------------------------------------------------------------------

test("19 - There's a single word above, first capital, ends with full stop", () => {
  equal(s("## Word?"), "markdown-header-word", "19");
});

test("20 - There are two words above, first capital, ends with full stop", () => {
  equal(s("## Two words?"), "markdown-header-two-words", "20");
});

test("21 - Three words, first capital, ends with full stop", () => {
  equal(s("## Three words here?"), "markdown-header-three-words-here", "21");
});

test("22 - There's a single word above, first lowercase, ends with full stop", () => {
  equal(s("## word?"), "markdown-header-word", "22");
});

test("23 - There are two words above, first lowercase, ends with full stop", () => {
  equal(s("## two words?"), "markdown-header-two-words", "23");
});

test("24 - Three words, first lowercase, ends with full stop", () => {
  equal(s("## three words here?"), "markdown-header-three-words-here", "24");
});

// 05. Exclamation mark
// -----------------------------------------------------------------------------

test("25 - There's a single word above, first capital, ends with exclamation mark", () => {
  equal(s("## Word!"), "markdown-header-word", "25");
});

test("26 - There are two words above, first capital, ends with exclamation mark", () => {
  equal(s("## Two words!"), "markdown-header-two-words", "26");
});

test("27 - Three words, first capital, ends with exclamation mark", () => {
  equal(s("## Three words here!"), "markdown-header-three-words-here", "27");
});

test("28 - There's a single word above, first lowercase, ends with exclamation mark", () => {
  equal(s("## word!"), "markdown-header-word", "28");
});

test("29 - There are two words above, first lowercase, ends with exclamation mark", () => {
  equal(s("## two words!"), "markdown-header-two-words", "29");
});

test("30 - Three words, first lowercase, ends with exclamation mark", () => {
  equal(s("## three words here!"), "markdown-header-three-words-here", "30");
});

// 06. Ellipsis
// -----------------------------------------------------------------------------

test("31 - There's a single word above, first capital, ends with ellipsis", () => {
  equal(s("## Word..."), "markdown-header-word", "31");
});

test("32 - There are two words above, first capital, ends with ellipsis", () => {
  equal(s("## Two words..."), "markdown-header-two-words", "32");
});

test("33 - Three words, first capital, ends with ellipsis", () => {
  equal(s("## Three words here..."), "markdown-header-three-words-here", "33");
});

test("34 - There's a single word above, first lowercase, ends with ellipsis", () => {
  equal(s("## word..."), "markdown-header-word", "34");
});

test("35 - There are two words above, first lowercase, ends with ellipsis", () => {
  equal(s("## two words..."), "markdown-header-two-words", "35");
});

test("36 - Three words, first lowercase, ends with ellipsis", () => {
  equal(s("## three words here..."), "markdown-header-three-words-here", "36");
});

// 07. Numbers
// -----------------------------------------------------------------------------

test("37 - Single number in the end", () => {
  equal(s("## Here is number 1"), "markdown-header-here-is-number-1", "37");
});

test("38 - Whole h2 is single digit", () => {
  equal(s("## 1"), "markdown-header-1", "38");
});

test("39 - H2 starts with digit", () => {
  equal(s("## 1 title"), "markdown-header-1-title", "39");
});

test("40 - Digit and letter, no space", () => {
  equal(s("## 1st title"), "markdown-header-1st-title", "40");
});

test("41 - Three digits in the h2", () => {
  equal(s("## 111 title"), "markdown-header-111-title", "41");
});

// 08. Double quotes
// -----------------------------------------------------------------------------

test("42 - Word with double quotes ends the H2", () => {
  equal(s(`## So-called "music"`), "markdown-header-so-called-music", "42");
});

test("43 - Double quotes mid-sentence", () => {
  equal(
    s(`## So-called "music" is being played`),
    "markdown-header-so-called-music-is-being-played",
    "43"
  );
});

test("44 - Double quotes starting the H2", () => {
  equal(
    s(`## "Music" is being played`),
    "markdown-header-music-is-being-played",
    "44"
  );
});

// 09. Hash

test("45 - Title starts with hash", () => {
  equal(s("## #hashtag"), "markdown-header-hashtag", "45");
});

test("46 - Title ends with word that starts with hash", () => {
  equal(
    s("## Let's tag the #hashtag"),
    "markdown-header-lets-tag-the-hashtag",
    "46"
  );
});

// 10. Dollar
// -----------------------------------------------------------------------------

test("47 - Title starts with dollar sign", () => {
  equal(s("## $100 dollars"), "markdown-header-100-dollars", "47");
});

test("48 - Title ends with single dollar sign", () => {
  equal(s("## Win some $"), "markdown-header-win-some", "48");
});

// 11. Percentage
// -----------------------------------------------------------------------------

test("49 - Percentage after word", () => {
  equal(s("## 25% cut"), "markdown-header-25-cut", "49");
});

test("50 - Percentage in the end", () => {
  equal(s("## cut %"), "markdown-header-cut", "50");
});

// 12. Ampersand
// -----------------------------------------------------------------------------

test("51 - Standalone ampersand", () => {
  equal(
    s("## Ampersand & ampersand"),
    "markdown-header-ampersand-ampersand",
    "51"
  );
});

test("52 - No space around ampersand", () => {
  equal(
    s("## Something&something"),
    "markdown-header-somethingsomething",
    "52"
  );
});

// 13. Single straight quote
// -----------------------------------------------------------------------------

test("53 - Single quote between letters", () => {
  equal(s("## Title's notation"), "markdown-header-titles-notation", "53");
});

test("54 - Single quote ends the H2", () => {
  equal(s("## Peoples'"), "markdown-header-peoples", "54");
});

// 14. Bracket
// -----------------------------------------------------------------------------

test("55 - Words with brackets", () => {
  equal(
    s("## Music (not this) is pleasure"),
    "markdown-header-music-not-this-is-pleasure",
    "55"
  );
});

test("56 - All H2 wrapped with brackets", () => {
  equal(s("## (Something)"), "markdown-header-something", "56");
});

// 15. Asterisk
// -----------------------------------------------------------------------------

test("57 - Asterisk in the end", () => {
  equal(s("## Something*"), "markdown-header-something", "57");
});

test("58 - Digits with asterisk, tight", () => {
  equal(s("## 2*2"), "markdown-header-22", "58");
});

test("59 - Asterisk surrounded by spaces", () => {
  equal(
    s("## Something * Something"),
    "markdown-header-something-something",
    "59"
  );
});

// 16. Plus
// -----------------------------------------------------------------------------

test("60 - Plus sign, spaces", () => {
  equal(
    s("## Something + anything"),
    "markdown-header-something-anything",
    "60"
  );
});

test("61 - Plus sign, tight", () => {
  equal(s("## Something+anything"), "markdown-header-somethinganything", "61");
});

// 17. Comma
// -----------------------------------------------------------------------------

test("62 - Comma, space", () => {
  equal(
    s("## Something, anything"),
    "markdown-header-something-anything",
    "62"
  );
});

test("63 - Comma, no space", () => {
  equal(s("## Something,anything"), "markdown-header-somethinganything", "63");
});

// 18. Slash
// -----------------------------------------------------------------------------

test("64 - Slash, no spaces", () => {
  equal(s("## Slash/dot"), "markdown-header-slashdot", "64");
});

test("65 - Slash with spaces", () => {
  equal(s("## Slash / dot"), "markdown-header-slash-dot", "65");
});

// 19. Digits
// -----------------------------------------------------------------------------

test("66 - All digits", () => {
  equal(
    s("## 1 2 3 4 5 6 7 8 9 0"),
    "markdown-header-1-2-3-4-5-6-7-8-9-0",
    "66"
  );
});

test("67 - All digits surrounded by letters", () => {
  equal(
    s("## aaa 1 2 3 4 5 6 7 8 9 0 bbb"),
    "markdown-header-aaa-1-2-3-4-5-6-7-8-9-0-bbb",
    "67"
  );
});

test("68 - All digits, no spaces", () => {
  equal(s("## 1234567890"), "markdown-header-1234567890", "68");
});

test("69 - All digits surrounded by letters, no spaces", () => {
  equal(s("## aaa1234567890bbb"), "markdown-header-aaa1234567890bbb", "69");
});

// 20. Colon
// -----------------------------------------------------------------------------

test("70 - Colon follows the word in h2", () => {
  equal(
    s("## Colons: practical, useful and, of course, legible"),
    "markdown-header-colons-practical-useful-and-of-course-legible",
    "70"
  );
});

// 21. Semicolon
// -----------------------------------------------------------------------------

test("71 - Semicolon after word", () => {
  equal(
    s("## Semicolons; What not follows"),
    "markdown-header-semicolons-what-not-follows",
    "71"
  );
});

test("72 - Semicolon in the end", () => {
  equal(s("## Semicolons;"), "markdown-header-semicolons", "72");
});

// 22. Less than, greater than and equal signs
// -----------------------------------------------------------------------------

test("73 - Less than", () => {
  equal(s("## a < b"), "markdown-header-a-b", "73");
});

test("74 - Greater than", () => {
  equal(s("## a > b"), "markdown-header-a-b", "74");
});

test("75 - Single equal", () => {
  equal(s("## a = b"), "markdown-header-a-b", "75");
});

test("76 - Tripple equal, tight", () => {
  equal(s("## a===b"), "markdown-header-ab", "76");
});

test("77 - Tripple equal, spaced", () => {
  equal(s("## a === b"), "markdown-header-a-b", "77");
});

// 23. Question mark, revisited
// -----------------------------------------------------------------------------

test("78 - Question mark in the end", () => {
  equal(
    s("## What is the point of testing this?"),
    "markdown-header-what-is-the-point-of-testing-this",
    "78"
  );
});

test("79 - Two question marks in H2", () => {
  equal(
    s("## What? Don't we need to test?"),
    "markdown-header-what-dont-we-need-to-test",
    "79"
  );
});

// 24. At sign
// -----------------------------------------------------------------------------

test("80 - Email address in the H2", () => {
  equal(
    s("## Email is: roy@domain.com"),
    "markdown-header-email-is-roydomaincom",
    "80"
  );
});

test("81 - @ sign surrounded with spaces", () => {
  equal(
    s("## Something @ something"),
    "markdown-header-something-something",
    "81"
  );
});

// 25. Link in the H tag
// -----------------------------------------------------------------------------

test("82 - Link in the H2", () => {
  equal(
    s("## [Something](https://codsen.com) link"),
    "markdown-header-something-link",
    "82"
  );
});

// 26. Left slash
// -----------------------------------------------------------------------------

test("83 - Left slash", () => {
  equal(s("## Left slash  here"), "markdown-header-left-slash-here", "83");
});

// 27. Caret
// -----------------------------------------------------------------------------

test("84 - Caret, tight", () => {
  equal(s("## Something^"), "markdown-header-something", "84");
});

test("85 - Caret, with space", () => {
  equal(s("## Something ^"), "markdown-header-something", "85");
});

// 28. Underscore
// -----------------------------------------------------------------------------

test("86 - Underscore between letters", () => {
  equal(s("## snake_case"), "markdown-header-snake_case", "86");
});

test("87 - Underscore surrounded by spaces", () => {
  equal(
    s("## something _ something"),
    "markdown-header-something-_-something",
    "87"
  );
});

// 29. Backtick
// -----------------------------------------------------------------------------

test("88 - Starts with backtick", () => {
  equal(
    s("## `variable` is in the beginning"),
    "markdown-header-variable-is-in-the-beginning",
    "88"
  );
});

test("89 - Middle", () => {
  equal(
    s("## Middle `variable` is here"),
    "markdown-header-middle-variable-is-here",
    "89"
  );
});

test("90 - Backtick in the end of H2", () => {
  equal(
    s("## Ends with `variable`"),
    "markdown-header-ends-with-variable",
    "90"
  );
});

// 30. Curly braces
// -----------------------------------------------------------------------------

test("91 - Curly braces", () => {
  equal(s("## Curlies {like this}"), "markdown-header-curlies-like-this", "91");
});

test("92 - And with spaces", () => {
  equal(
    s("## Curlies { and like this }"),
    "markdown-header-curlies-and-like-this",
    "92"
  );
});

// 31. Pipe character
// -----------------------------------------------------------------------------

test("93 - Single pipe", () => {
  equal(s("## Pipe character |"), "markdown-header-pipe-character", "93");
});

test("94 - Double pipe", () => {
  equal(
    s(`## Something || something means "or"`),
    "markdown-header-something-something-means-or",
    "94"
  );
});

// 32. Tilde
// -----------------------------------------------------------------------------

test("95 - Single tilde in front of digit", () => {
  equal(
    s("## Tilde means approximately ~100"),
    "markdown-header-tilde-means-approximately-100",
    "95"
  );
});

test("96 - Single tilde in front of word", () => {
  equal(s("## Tilde ~ here"), "markdown-header-tilde-here", "96");
});

test("97 - Tight tilde", () => {
  equal(s("## tilde~tilde"), "markdown-header-tildetilde", "97");
});

// 33. Different languages
// -----------------------------------------------------------------------------

test("98 - Lithuanian", () => {
  equal(
    s("## Some Lithuanian - Ąžuolynas"),
    "markdown-header-some-lithuanian-azuolynas",
    "98"
  );
});

test("99 - Russian language", () => {
  equal(s("## Путин, Владимир Владимирович"), "markdown-header-", "99");
});

test("100 - Japanese language", () => {
  equal(s("## Author 村上春樹"), "markdown-header-author", "100");
});

// 34. Currencies
// -----------------------------------------------------------------------------

test("101 - Pounds", () => {
  equal(s("## Price is £10"), "markdown-header-price-is-10", "101");
});

test("102 - Dollars", () => {
  equal(s("## Price is 100$"), "markdown-header-price-is-100", "102");
});

test("103 - Euros", () => {
  equal(s("## Price is €10"), "markdown-header-price-is-10", "103");
});

// 35. Various
// -----------------------------------------------------------------------------

test("104 - Emoji in the headings", () => {
  equal(s("## 🦄 Unicorn title"), "markdown-header-unicorn-title", "104");
});

test("105 - Emoji in the headings", () => {
  equal(s("## ♥ Heart title"), "markdown-header-heart-title", "105");
});

test("106 - Multiple consecutive dashes surrounded by spaces", () => {
  equal(
    s("## Title -- is the best"),
    "markdown-header-title-is-the-best",
    "106.01"
  );
  equal(
    s("## Title --- is the best"),
    "markdown-header-title-is-the-best",
    "106.02"
  );
});

test("107 - A bug from real life, #1", () => {
  equal(
    s(
      "## Example - treating the image alt attributes - Gulp and stream-tapping"
    ),
    "markdown-header-example-treating-the-image-alt-attributes-gulp-and-stream-tapping",
    "107"
  );
});

test.run();
