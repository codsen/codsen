import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { bSlug as s } from "../dist/bitbucket-slug.esm.js";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01 - empty input", () => {
  equal(s(), "", "01.01");
});
test("02 - number input", () => {
  equal(s(1), "", "02.01");
});
test("03 - null input", () => {
  equal(s(null), "", "03.01");
});
test("04 - undefined input", () => {
  equal(s(undefined), "", "04.01");
});
test("05 - Boolean input", () => {
  equal(s(true), "", "05.01");
});

// 02. No punctuation in the end
// -----------------------------------------------------------------------------

test("06 - h1 slug", () => {
  equal(
    s("# Let's backwards-engineer BitBucket anchor link slug algorithm"),
    "markdown-header-lets-backwards-engineer-bitbucket-anchor-link-slug-algorithm",
    "06.01",
  );
});

test("07 - There's a single word above, first capital", () => {
  equal(s("## Word"), "markdown-header-word", "07.01");
});

test("08 - There are two words above, first capital", () => {
  equal(s("## Two words"), "markdown-header-two-words", "08.01");
});

test("09 - Three words, first capital", () => {
  equal(s("## Three words here"), "markdown-header-three-words-here", "09.01");
});

test("10 - There's a single word above, first lowercase", () => {
  equal(s("## word"), "markdown-header-word", "10.01");
});

test("11 - There are two words above, first lowercase", () => {
  equal(s("## two words"), "markdown-header-two-words", "11.01");
});

test("12 - Three words, first lowercase", () => {
  equal(s("## three words here"), "markdown-header-three-words-here", "12.01");
});

// 03. Ends with full stop
// -----------------------------------------------------------------------------

test("13 - There's a single word above, first capital, ends with full stop", () => {
  equal(s("## Word."), "markdown-header-word", "13.01");
});

test("14 - There are two words above, first capital, ends with full stop", () => {
  equal(s("## Two words."), "markdown-header-two-words", "14.01");
});

test("15 - Three words, first capital, ends with full stop", () => {
  equal(s("## Three words here."), "markdown-header-three-words-here", "15.01");
});

test("16 - There's a single word above, first lowercase, ends with full stop", () => {
  equal(s("## word."), "markdown-header-word", "16.01");
});

test("17 - There are two words above, first lowercase, ends with full stop", () => {
  equal(s("## two words."), "markdown-header-two-words", "17.01");
});

test("18 - Three words, first lowercase, ends with full stop", () => {
  equal(s("## three words here."), "markdown-header-three-words-here", "18.01");
});

// 04. Question mark
// -----------------------------------------------------------------------------

test("19 - There's a single word above, first capital, ends with full stop", () => {
  equal(s("## Word?"), "markdown-header-word", "19.01");
});

test("20 - There are two words above, first capital, ends with full stop", () => {
  equal(s("## Two words?"), "markdown-header-two-words", "20.01");
});

test("21 - Three words, first capital, ends with full stop", () => {
  equal(s("## Three words here?"), "markdown-header-three-words-here", "21.01");
});

test("22 - There's a single word above, first lowercase, ends with full stop", () => {
  equal(s("## word?"), "markdown-header-word", "22.01");
});

test("23 - There are two words above, first lowercase, ends with full stop", () => {
  equal(s("## two words?"), "markdown-header-two-words", "23.01");
});

test("24 - Three words, first lowercase, ends with full stop", () => {
  equal(s("## three words here?"), "markdown-header-three-words-here", "24.01");
});

// 05. Exclamation mark
// -----------------------------------------------------------------------------

test("25 - There's a single word above, first capital, ends with exclamation mark", () => {
  equal(s("## Word!"), "markdown-header-word", "25.01");
});

test("26 - There are two words above, first capital, ends with exclamation mark", () => {
  equal(s("## Two words!"), "markdown-header-two-words", "26.01");
});

test("27 - Three words, first capital, ends with exclamation mark", () => {
  equal(s("## Three words here!"), "markdown-header-three-words-here", "27.01");
});

test("28 - There's a single word above, first lowercase, ends with exclamation mark", () => {
  equal(s("## word!"), "markdown-header-word", "28.01");
});

test("29 - There are two words above, first lowercase, ends with exclamation mark", () => {
  equal(s("## two words!"), "markdown-header-two-words", "29.01");
});

test("30 - Three words, first lowercase, ends with exclamation mark", () => {
  equal(s("## three words here!"), "markdown-header-three-words-here", "30.01");
});

// 06. Ellipsis
// -----------------------------------------------------------------------------

test("31 - There's a single word above, first capital, ends with ellipsis", () => {
  equal(s("## Word..."), "markdown-header-word", "31.01");
});

test("32 - There are two words above, first capital, ends with ellipsis", () => {
  equal(s("## Two words..."), "markdown-header-two-words", "32.01");
});

test("33 - Three words, first capital, ends with ellipsis", () => {
  equal(
    s("## Three words here..."),
    "markdown-header-three-words-here",
    "33.01",
  );
});

test("34 - There's a single word above, first lowercase, ends with ellipsis", () => {
  equal(s("## word..."), "markdown-header-word", "34.01");
});

test("35 - There are two words above, first lowercase, ends with ellipsis", () => {
  equal(s("## two words..."), "markdown-header-two-words", "35.01");
});

test("36 - Three words, first lowercase, ends with ellipsis", () => {
  equal(
    s("## three words here..."),
    "markdown-header-three-words-here",
    "36.01",
  );
});

// 07. Numbers
// -----------------------------------------------------------------------------

test("37 - Single number in the end", () => {
  equal(s("## Here is number 1"), "markdown-header-here-is-number-1", "37.01");
});

test("38 - Whole h2 is single digit", () => {
  equal(s("## 1"), "markdown-header-1", "38.01");
});

test("39 - H2 starts with digit", () => {
  equal(s("## 1 title"), "markdown-header-1-title", "39.01");
});

test("40 - Digit and letter, no space", () => {
  equal(s("## 1st title"), "markdown-header-1st-title", "40.01");
});

test("41 - Three digits in the h2", () => {
  equal(s("## 111 title"), "markdown-header-111-title", "41.01");
});

// 08. Double quotes
// -----------------------------------------------------------------------------

test("42 - Word with double quotes ends the H2", () => {
  equal(s('## So-called "music"'), "markdown-header-so-called-music", "42.01");
});

test("43 - Double quotes mid-sentence", () => {
  equal(
    s('## So-called "music" is being played'),
    "markdown-header-so-called-music-is-being-played",
    "43.01",
  );
});

test("44 - Double quotes starting the H2", () => {
  equal(
    s('## "Music" is being played'),
    "markdown-header-music-is-being-played",
    "44.01",
  );
});

// 09. Hash

test("45 - Title starts with hash", () => {
  equal(s("## #hashtag"), "markdown-header-hashtag", "45.01");
});

test("46 - Title ends with word that starts with hash", () => {
  equal(
    s("## Let's tag the #hashtag"),
    "markdown-header-lets-tag-the-hashtag",
    "46.01",
  );
});

// 10. Dollar
// -----------------------------------------------------------------------------

test("47 - Title starts with dollar sign", () => {
  equal(s("## $100 dollars"), "markdown-header-100-dollars", "47.01");
});

test("48 - Title ends with single dollar sign", () => {
  equal(s("## Win some $"), "markdown-header-win-some", "48.01");
});

// 11. Percentage
// -----------------------------------------------------------------------------

test("49 - Percentage after word", () => {
  equal(s("## 25% cut"), "markdown-header-25-cut", "49.01");
});

test("50 - Percentage in the end", () => {
  equal(s("## cut %"), "markdown-header-cut", "50.01");
});

// 12. Ampersand
// -----------------------------------------------------------------------------

test("51 - Standalone ampersand", () => {
  equal(
    s("## Ampersand & ampersand"),
    "markdown-header-ampersand-ampersand",
    "51.01",
  );
});

test("52 - No space around ampersand", () => {
  equal(
    s("## Something&something"),
    "markdown-header-somethingsomething",
    "52.01",
  );
});

// 13. Single straight quote
// -----------------------------------------------------------------------------

test("53 - Single quote between letters", () => {
  equal(s("## Title's notation"), "markdown-header-titles-notation", "53.01");
});

test("54 - Single quote ends the H2", () => {
  equal(s("## Peoples'"), "markdown-header-peoples", "54.01");
});

// 14. Bracket
// -----------------------------------------------------------------------------

test("55 - Words with brackets", () => {
  equal(
    s("## Music (not this) is pleasure"),
    "markdown-header-music-not-this-is-pleasure",
    "55.01",
  );
});

test("56 - All H2 wrapped with brackets", () => {
  equal(s("## (Something)"), "markdown-header-something", "56.01");
});

// 15. Asterisk
// -----------------------------------------------------------------------------

test("57 - Asterisk in the end", () => {
  equal(s("## Something*"), "markdown-header-something", "57.01");
});

test("58 - Digits with asterisk, tight", () => {
  equal(s("## 2*2"), "markdown-header-22", "58.01");
});

test("59 - Asterisk surrounded by spaces", () => {
  equal(
    s("## Something * Something"),
    "markdown-header-something-something",
    "59.01",
  );
});

// 16. Plus
// -----------------------------------------------------------------------------

test("60 - Plus sign, spaces", () => {
  equal(
    s("## Something + anything"),
    "markdown-header-something-anything",
    "60.01",
  );
});

test("61 - Plus sign, tight", () => {
  equal(
    s("## Something+anything"),
    "markdown-header-somethinganything",
    "61.01",
  );
});

// 17. Comma
// -----------------------------------------------------------------------------

test("62 - Comma, space", () => {
  equal(
    s("## Something, anything"),
    "markdown-header-something-anything",
    "62.01",
  );
});

test("63 - Comma, no space", () => {
  equal(
    s("## Something,anything"),
    "markdown-header-somethinganything",
    "63.01",
  );
});

// 18. Slash
// -----------------------------------------------------------------------------

test("64 - Slash, no spaces", () => {
  equal(s("## Slash/dot"), "markdown-header-slashdot", "64.01");
});

test("65 - Slash with spaces", () => {
  equal(s("## Slash / dot"), "markdown-header-slash-dot", "65.01");
});

// 19. Digits
// -----------------------------------------------------------------------------

test("66 - All digits", () => {
  equal(
    s("## 1 2 3 4 5 6 7 8 9 0"),
    "markdown-header-1-2-3-4-5-6-7-8-9-0",
    "66.01",
  );
});

test("67 - All digits surrounded by letters", () => {
  equal(
    s("## aaa 1 2 3 4 5 6 7 8 9 0 bbb"),
    "markdown-header-aaa-1-2-3-4-5-6-7-8-9-0-bbb",
    "67.01",
  );
});

test("68 - All digits, no spaces", () => {
  equal(s("## 1234567890"), "markdown-header-1234567890", "68.01");
});

test("69 - All digits surrounded by letters, no spaces", () => {
  equal(s("## aaa1234567890bbb"), "markdown-header-aaa1234567890bbb", "69.01");
});

// 20. Colon
// -----------------------------------------------------------------------------

test("70 - Colon follows the word in h2", () => {
  equal(
    s("## Colons: practical, useful and, of course, legible"),
    "markdown-header-colons-practical-useful-and-of-course-legible",
    "70.01",
  );
});

// 21. Semicolon
// -----------------------------------------------------------------------------

test("71 - Semicolon after word", () => {
  equal(
    s("## Semicolons; What not follows"),
    "markdown-header-semicolons-what-not-follows",
    "71.01",
  );
});

test("72 - Semicolon in the end", () => {
  equal(s("## Semicolons;"), "markdown-header-semicolons", "72.01");
});

// 22. Less than, greater than and equal signs
// -----------------------------------------------------------------------------

test("73 - Less than", () => {
  equal(s("## a < b"), "markdown-header-a-b", "73.01");
});

test("74 - Greater than", () => {
  equal(s("## a > b"), "markdown-header-a-b", "74.01");
});

test("75 - Single equal", () => {
  equal(s("## a = b"), "markdown-header-a-b", "75.01");
});

test("76 - Tripple equal, tight", () => {
  equal(s("## a===b"), "markdown-header-ab", "76.01");
});

test("77 - Tripple equal, spaced", () => {
  equal(s("## a === b"), "markdown-header-a-b", "77.01");
});

// 23. Question mark, revisited
// -----------------------------------------------------------------------------

test("78 - Question mark in the end", () => {
  equal(
    s("## What is the point of testing this?"),
    "markdown-header-what-is-the-point-of-testing-this",
    "78.01",
  );
});

test("79 - Two question marks in H2", () => {
  equal(
    s("## What? Don't we need to test?"),
    "markdown-header-what-dont-we-need-to-test",
    "79.01",
  );
});

// 24. At sign
// -----------------------------------------------------------------------------

test("80 - Email address in the H2", () => {
  equal(
    s("## Email is: roy@domain.com"),
    "markdown-header-email-is-roydomaincom",
    "80.01",
  );
});

test("81 - @ sign surrounded with spaces", () => {
  equal(
    s("## Something @ something"),
    "markdown-header-something-something",
    "81.01",
  );
});

// 25. Link in the H tag
// -----------------------------------------------------------------------------

test("82 - Link in the H2", () => {
  equal(
    s("## [Something](https://codsen.com) link"),
    "markdown-header-something-link",
    "82.01",
  );
});

// 26. Left slash
// -----------------------------------------------------------------------------

test("83 - Left slash", () => {
  equal(s("## Left slash  here"), "markdown-header-left-slash-here", "83.01");
});

// 27. Caret
// -----------------------------------------------------------------------------

test("84 - Caret, tight", () => {
  equal(s("## Something^"), "markdown-header-something", "84.01");
});

test("85 - Caret, with space", () => {
  equal(s("## Something ^"), "markdown-header-something", "85.01");
});

// 28. Underscore
// -----------------------------------------------------------------------------

test("86 - Underscore between letters", () => {
  equal(s("## snake_case"), "markdown-header-snake_case", "86.01");
});

test("87 - Underscore surrounded by spaces", () => {
  equal(
    s("## something _ something"),
    "markdown-header-something-_-something",
    "87.01",
  );
});

// 29. Backtick
// -----------------------------------------------------------------------------

test("88 - Starts with backtick", () => {
  equal(
    s("## `variable` is in the beginning"),
    "markdown-header-variable-is-in-the-beginning",
    "88.01",
  );
});

test("89 - Middle", () => {
  equal(
    s("## Middle `variable` is here"),
    "markdown-header-middle-variable-is-here",
    "89.01",
  );
});

test("90 - Backtick in the end of H2", () => {
  equal(
    s("## Ends with `variable`"),
    "markdown-header-ends-with-variable",
    "90.01",
  );
});

// 30. Curly braces
// -----------------------------------------------------------------------------

test("91 - Curly braces", () => {
  equal(
    s("## Curlies {like this}"),
    "markdown-header-curlies-like-this",
    "91.01",
  );
});

test("92 - And with spaces", () => {
  equal(
    s("## Curlies { and like this }"),
    "markdown-header-curlies-and-like-this",
    "92.01",
  );
});

// 31. Pipe character
// -----------------------------------------------------------------------------

test("93 - Single pipe", () => {
  equal(s("## Pipe character |"), "markdown-header-pipe-character", "93.01");
});

test("94 - Double pipe", () => {
  equal(
    s('## Something || something means "or"'),
    "markdown-header-something-something-means-or",
    "94.01",
  );
});

// 32. Tilde
// -----------------------------------------------------------------------------

test("95 - Single tilde in front of digit", () => {
  equal(
    s("## Tilde means approximately ~100"),
    "markdown-header-tilde-means-approximately-100",
    "95.01",
  );
});

test("96 - Single tilde in front of word", () => {
  equal(s("## Tilde ~ here"), "markdown-header-tilde-here", "96.01");
});

test("97 - Tight tilde", () => {
  equal(s("## tilde~tilde"), "markdown-header-tildetilde", "97.01");
});

// 33. Different languages
// -----------------------------------------------------------------------------

test("98 - Lithuanian", () => {
  equal(
    s("## Some Lithuanian - Ąžuolynas"),
    "markdown-header-some-lithuanian-azuolynas",
    "98.01",
  );
});

test("99 - Russian language", () => {
  equal(s("## Путин, Владимир Владимирович"), "markdown-header-", "99.01");
});

test("100 - Japanese language", () => {
  equal(s("## Author 村上春樹"), "markdown-header-author", "100.01");
});

// 34. Currencies
// -----------------------------------------------------------------------------

test("101 - Pounds", () => {
  equal(s("## Price is £10"), "markdown-header-price-is-10", "101.01");
});

test("102 - Dollars", () => {
  equal(s("## Price is 100$"), "markdown-header-price-is-100", "102.01");
});

test("103 - Euros", () => {
  equal(s("## Price is €10"), "markdown-header-price-is-10", "103.01");
});

// 35. Various
// -----------------------------------------------------------------------------

test("104 - Emoji in the headings", () => {
  equal(s("## 🦄 Unicorn title"), "markdown-header-unicorn-title", "104.01");
});

test("105 - Emoji in the headings", () => {
  equal(s("## ♥ Heart title"), "markdown-header-heart-title", "105.01");
});

test("106 - Multiple consecutive dashes surrounded by spaces", () => {
  equal(
    s("## Title -- is the best"),
    "markdown-header-title-is-the-best",
    "106.01",
  );
  equal(
    s("## Title --- is the best"),
    "markdown-header-title-is-the-best",
    "106.02",
  );
});

test("107 - A bug from real life, #1", () => {
  equal(
    s(
      "## Example - treating the image alt attributes - Gulp and stream-tapping",
    ),
    "markdown-header-example-treating-the-image-alt-attributes-gulp-and-stream-tapping",
    "107.01",
  );
});

test.run();
