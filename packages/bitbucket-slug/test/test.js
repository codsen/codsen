import test from "ava";
import s from "../dist/bitbucket-slug.esm";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01.01 - empty input", t => {
  t.is(s(), "", "01.01");
});
test("01.02 - number input", t => {
  t.is(s(1), "", "01.02");
});
test("01.03 - null input", t => {
  t.is(s(null), "", "01.03");
});
test("01.04 - undefined input", t => {
  t.is(s(undefined), "", "01.04");
});
test("01.05 - Boolean input", t => {
  t.is(s(true), "", "01.05");
});

// 02. No punctuation in the end
// -----------------------------------------------------------------------------

test("02.01 - h1 slug", t => {
  t.is(
    s("# Let's backwards-engineer BitBucket anchor link slug algorithm"),
    "markdown-header-lets-backwards-engineer-bitbucket-anchor-link-slug-algorithm",
    "02.01"
  );
});

test("02.02 - There's a single word above, first capital", t => {
  t.is(s("## Word"), "markdown-header-word", "02.02");
});

test("02.03 - There are two words above, first capital", t => {
  t.is(s("## Two words"), "markdown-header-two-words", "02.03");
});

test("02.04 - Three words, first capital", t => {
  t.is(s("## Three words here"), "markdown-header-three-words-here", "02.04");
});

test("02.05 - There's a single word above, first lowercase", t => {
  t.is(s("## word"), "markdown-header-word", "02.05");
});

test("02.06 - There are two words above, first lowercase", t => {
  t.is(s("## two words"), "markdown-header-two-words", "02.06");
});

test("02.07 - Three words, first lowercase", t => {
  t.is(s("## three words here"), "markdown-header-three-words-here", "02.07");
});

// 03. Ends with full stop
// -----------------------------------------------------------------------------

test("03.01 - There's a single word above, first capital, ends with full stop", t => {
  t.is(s("## Word."), "markdown-header-word", "03.01");
});

test("03.02 - There are two words above, first capital, ends with full stop", t => {
  t.is(s("## Two words."), "markdown-header-two-words", "03.02");
});

test("03.03 - Three words, first capital, ends with full stop", t => {
  t.is(s("## Three words here."), "markdown-header-three-words-here", "03.03");
});

test("03.04 - There's a single word above, first lowercase, ends with full stop", t => {
  t.is(s("## word."), "markdown-header-word", "03.04");
});

test("03.05 - There are two words above, first lowercase, ends with full stop", t => {
  t.is(s("## two words."), "markdown-header-two-words", "03.05");
});

test("03.06 - Three words, first lowercase, ends with full stop", t => {
  t.is(s("## three words here."), "markdown-header-three-words-here", "03.06");
});

// 04. Question mark
// -----------------------------------------------------------------------------

test("04.01 - There's a single word above, first capital, ends with full stop", t => {
  t.is(s("## Word?"), "markdown-header-word", "04.01");
});

test("04.02 - There are two words above, first capital, ends with full stop", t => {
  t.is(s("## Two words?"), "markdown-header-two-words", "04.02");
});

test("04.03 - Three words, first capital, ends with full stop", t => {
  t.is(s("## Three words here?"), "markdown-header-three-words-here", "04.03");
});

test("04.04 - There's a single word above, first lowercase, ends with full stop", t => {
  t.is(s("## word?"), "markdown-header-word", "04.04");
});

test("04.05 - There are two words above, first lowercase, ends with full stop", t => {
  t.is(s("## two words?"), "markdown-header-two-words", "04.05");
});

test("04.06 - Three words, first lowercase, ends with full stop", t => {
  t.is(s("## three words here?"), "markdown-header-three-words-here", "04.06");
});

// 05. Exclamation mark
// -----------------------------------------------------------------------------

test("05.01 - There's a single word above, first capital, ends with exclamation mark", t => {
  t.is(s("## Word!"), "markdown-header-word", "05.01");
});

test("05.02 - There are two words above, first capital, ends with exclamation mark", t => {
  t.is(s("## Two words!"), "markdown-header-two-words", "05.02");
});

test("05.03 - Three words, first capital, ends with exclamation mark", t => {
  t.is(s("## Three words here!"), "markdown-header-three-words-here", "05.03");
});

test("05.04 - There's a single word above, first lowercase, ends with exclamation mark", t => {
  t.is(s("## word!"), "markdown-header-word", "05.04");
});

test("05.05 - There are two words above, first lowercase, ends with exclamation mark", t => {
  t.is(s("## two words!"), "markdown-header-two-words", "05.05");
});

test("05.06 - Three words, first lowercase, ends with exclamation mark", t => {
  t.is(s("## three words here!"), "markdown-header-three-words-here", "05.06");
});

// 06. Ellipsis
// -----------------------------------------------------------------------------

test("06.01 - There's a single word above, first capital, ends with ellipsis", t => {
  t.is(s("## Word..."), "markdown-header-word", "06.01");
});

test("06.02 - There are two words above, first capital, ends with ellipsis", t => {
  t.is(s("## Two words..."), "markdown-header-two-words", "06.02");
});

test("06.03 - Three words, first capital, ends with ellipsis", t => {
  t.is(
    s("## Three words here..."),
    "markdown-header-three-words-here",
    "06.03"
  );
});

test("06.04 - There's a single word above, first lowercase, ends with ellipsis", t => {
  t.is(s("## word..."), "markdown-header-word", "06.04");
});

test("06.05 - There are two words above, first lowercase, ends with ellipsis", t => {
  t.is(s("## two words..."), "markdown-header-two-words", "06.05");
});

test("06.06 - Three words, first lowercase, ends with ellipsis", t => {
  t.is(
    s("## three words here..."),
    "markdown-header-three-words-here",
    "06.06"
  );
});

// 07. Numbers
// -----------------------------------------------------------------------------

test("07.01 - Single number in the end", t => {
  t.is(s("## Here is number 1"), "markdown-header-here-is-number-1", "07.01");
});

test("07.01 - Whole h2 is single digit", t => {
  t.is(s("## 1"), "markdown-header-1", "07.01");
});

test("07.01 - H2 starts with digit", t => {
  t.is(s("## 1 title"), "markdown-header-1-title", "07.01");
});

test("07.01 - Digit and letter, no space", t => {
  t.is(s("## 1st title"), "markdown-header-1st-title", "07.01");
});

test("07.01 - Three digits in the h2", t => {
  t.is(s("## 111 title"), "markdown-header-111-title", "07.01");
});

// 08. Double quotes
// -----------------------------------------------------------------------------

test("08.01 - Word with double quotes ends the H2", t => {
  t.is(s(`## So-called "music"`), "markdown-header-so-called-music", "08.01");
});

test("08.02 - Double quotes mid-sentence", t => {
  t.is(
    s(`## So-called "music" is being played`),
    "markdown-header-so-called-music-is-being-played",
    "08.02"
  );
});

test("08.03 - Double quotes starting the H2", t => {
  t.is(
    s(`## "Music" is being played`),
    "markdown-header-music-is-being-played",
    "08.03"
  );
});

// 09. Hash

test("09.01 - Title starts with hash", t => {
  t.is(s("## #hashtag"), "markdown-header-hashtag", "09.01");
});

test("09.01 - Title ends with word that starts with hash", t => {
  t.is(
    s("## Let's tag the #hashtag"),
    "markdown-header-lets-tag-the-hashtag",
    "09.01"
  );
});

// 10. Dollar
// -----------------------------------------------------------------------------

test("10.01 - Title starts with dollar sign", t => {
  t.is(s("## $100 dollars"), "markdown-header-100-dollars", "10.01");
});

test("10.02 - Title ends with single dollar sign", t => {
  t.is(s("## Win some $"), "markdown-header-win-some", "10.02");
});

// 11. Percentage
// -----------------------------------------------------------------------------

test("11.01 - Percentage after word", t => {
  t.is(s("## 25% cut"), "markdown-header-25-cut", "11.01");
});

test("11.02 - Percentage in the end", t => {
  t.is(s("## cut %"), "markdown-header-cut", "11.02");
});

// 12. Ampersand
// -----------------------------------------------------------------------------

test("12.01 - Standalone ampersand", t => {
  t.is(
    s("## Ampersand & ampersand"),
    "markdown-header-ampersand-ampersand",
    "12.01"
  );
});

test("12.02 - No space around ampersand", t => {
  t.is(
    s("## Something&something"),
    "markdown-header-somethingsomething",
    "12.02"
  );
});

test("12.03 - Standalone ampersand", t => {
  t.is(
    s("## Ampersand &amp; ampersand"),
    "markdown-header-ampersand-ampersand",
    "12.03 - encoded"
  );
});

test("12.04 - No space around ampersand", t => {
  t.is(
    s("## Something&amp;something"),
    "markdown-header-somethingsomething",
    "12.04 - encoded"
  );
});

// 13. Single straight quote
// -----------------------------------------------------------------------------

test("13.01 - Single quote between letters", t => {
  t.is(s("## Title's notation"), "markdown-header-titles-notation", "13.01");
});

test("13.02 - Single quote ends the H2", t => {
  t.is(s("## Peoples'"), "markdown-header-peoples", "13.02");
});

// 14. Bracket
// -----------------------------------------------------------------------------

test("14.01 - Words with brackets", t => {
  t.is(
    s("## Music (not this) is pleasure"),
    "markdown-header-music-not-this-is-pleasure",
    "14.01"
  );
});

test("14.02 - All H2 wrapped with brackets", t => {
  t.is(s("## (Something)"), "markdown-header-something", "14.02");
});

// 15. Asterisk
// -----------------------------------------------------------------------------

test("15.01 - Asterisk in the end", t => {
  t.is(s("## Something*"), "markdown-header-something", "15.01");
});

test("15.02 - Digits with asterisk, tight", t => {
  t.is(s("## 2*2"), "markdown-header-22", "15.02");
});

test("15.03 - Asterisk surrounded by spaces", t => {
  t.is(
    s("## Something * Something"),
    "markdown-header-something-something",
    "15.03"
  );
});

// 16. Plus
// -----------------------------------------------------------------------------

test("16.02 - Plus sign, spaces", t => {
  t.is(
    s("## Something + anything"),
    "markdown-header-something-anything",
    "16.02"
  );
});

test("16.02 - Plus sign, tight", t => {
  t.is(
    s("## Something+anything"),
    "markdown-header-somethinganything",
    "16.02"
  );
});

// 17. Comma
// -----------------------------------------------------------------------------

test("17.01 - Comma, space", t => {
  t.is(
    s("## Something, anything"),
    "markdown-header-something-anything",
    "17.01"
  );
});

test("17.02 - Comma, no space", t => {
  t.is(
    s("## Something,anything"),
    "markdown-header-somethinganything",
    "17.02"
  );
});

// 18. Slash
// -----------------------------------------------------------------------------

test("18.01 - Slash, no spaces", t => {
  t.is(s("## Slash/dot"), "markdown-header-slashdot", "18.01");
});

test("18.02 - Slash with spaces", t => {
  t.is(s("## Slash / dot"), "markdown-header-slash-dot", "18.02");
});

// 19. Digits
// -----------------------------------------------------------------------------

test("19.01 - All digits", t => {
  t.is(
    s("## 1 2 3 4 5 6 7 8 9 0"),
    "markdown-header-1-2-3-4-5-6-7-8-9-0",
    "19.01"
  );
});

test("19.02 - All digits surrounded by letters", t => {
  t.is(
    s("## aaa 1 2 3 4 5 6 7 8 9 0 bbb"),
    "markdown-header-aaa-1-2-3-4-5-6-7-8-9-0-bbb",
    "19.02"
  );
});

test("19.03 - All digits, no spaces", t => {
  t.is(s("## 1234567890"), "markdown-header-1234567890", "19.03");
});

test("19.04 - All digits surrounded by letters, no spaces", t => {
  t.is(s("## aaa1234567890bbb"), "markdown-header-aaa1234567890bbb", "19.04");
});

// 20. Colon
// -----------------------------------------------------------------------------

test("20.01 - Colon follows the word in h2", t => {
  t.is(
    s("## Colons: practical, useful and, of course, legible"),
    "markdown-header-colons-practical-useful-and-of-course-legible",
    "20.01"
  );
});

// 21. Semicolon
// -----------------------------------------------------------------------------

test("21.01 - Semicolon after word", t => {
  t.is(
    s("## Semicolons; What not follows"),
    "markdown-header-semicolons-what-not-follows",
    "21.01"
  );
});

test("21.01 - Semicolon in the end", t => {
  t.is(s("## Semicolons;"), "markdown-header-semicolons", "21.01");
});

// 22. Less than, greater than and equal signs
// -----------------------------------------------------------------------------

test("22.01 - Less than", t => {
  t.is(s("## a < b"), "markdown-header-a-b", "22.01");
});

test("22.02 - Greater than", t => {
  t.is(s("## a > b"), "markdown-header-a-b", "22.02");
});

test("22.03 - Single equal", t => {
  t.is(s("## a = b"), "markdown-header-a-b", "22.03");
});

test("22.04 - Tripple equal, tight", t => {
  t.is(s("## a===b"), "markdown-header-ab", "22.04");
});

test("22.05 - Tripple equal, spaced", t => {
  t.is(s("## a === b"), "markdown-header-a-b", "22.05");
});

// 23. Question mark, revisited
// -----------------------------------------------------------------------------

test("23.01 - Question mark in the end", t => {
  t.is(
    s("## What is the point of testing this?"),
    "markdown-header-what-is-the-point-of-testing-this",
    "23.01"
  );
});

test("23.02 - Two question marks in H2", t => {
  t.is(
    s("## What? Don't we need to test?"),
    "markdown-header-what-dont-we-need-to-test",
    "23.02"
  );
});

// 24. At sign
// -----------------------------------------------------------------------------

test("24.01 - Email address in the H2", t => {
  t.is(
    s("## Email is: roy@domain.com"),
    "markdown-header-email-is-roydomaincom",
    "24.01"
  );
});

test("24.02 - @ sign surrounded with spaces", t => {
  t.is(
    s("## Something @ something"),
    "markdown-header-something-something",
    "24.02"
  );
});

// 25. Link in the H tag
// -----------------------------------------------------------------------------

test("25.01 - Link in the H2", t => {
  t.is(
    s("## [Something](https://codsen.com) link"),
    "markdown-header-something-link",
    "25.01"
  );
});

// 26. Left slash
// -----------------------------------------------------------------------------

test("26.01 - Left slash", t => {
  t.is(s("## Left slash  here"), "markdown-header-left-slash-here", "26.01");
});

// 27. Caret
// -----------------------------------------------------------------------------

test("27.01 - Caret, tight", t => {
  t.is(s("## Something^"), "markdown-header-something", "27.01");
});

test("27.02 - Caret, with space", t => {
  t.is(s("## Something ^"), "markdown-header-something", "27.02");
});

// 28. Underscore
// -----------------------------------------------------------------------------

test("28.01 - Underscore between letters", t => {
  t.is(s("## snake_case"), "markdown-header-snake_case", "28.01");
});

test("28.02 - Underscore surrounded by spaces", t => {
  t.is(
    s("## something _ something"),
    "markdown-header-something-_-something",
    "28.02"
  );
});

// 29. Backtick
// -----------------------------------------------------------------------------

test("29.01 - Starts with backtick", t => {
  t.is(
    s("## `variable` is in the beginning"),
    "markdown-header-variable-is-in-the-beginning",
    "29.01"
  );
});

test("29.02 - Middle", t => {
  t.is(
    s("## Middle `variable` is here"),
    "markdown-header-middle-variable-is-here",
    "29.02"
  );
});

test("29.03 - Backtick in the end of H2", t => {
  t.is(
    s("## Ends with `variable`"),
    "markdown-header-ends-with-variable",
    "29.03"
  );
});

// 30. Curly braces
// -----------------------------------------------------------------------------

test("30.01 - Curly braces", t => {
  t.is(
    s("## Curlies {like this}"),
    "markdown-header-curlies-like-this",
    "30.01"
  );
});

test("30.02 - And with spaces", t => {
  t.is(
    s("## Curlies { and like this }"),
    "markdown-header-curlies-and-like-this",
    "30.02"
  );
});

// 31. Pipe character
// -----------------------------------------------------------------------------

test("31.01 - Single pipe", t => {
  t.is(s("## Pipe character |"), "markdown-header-pipe-character", "31.01");
});

test("31.02 - Double pipe", t => {
  t.is(
    s(`## Something || something means "or"`),
    "markdown-header-something-something-means-or",
    "31.02"
  );
});

// 32. Tilde
// -----------------------------------------------------------------------------

test("32.01 - Single tilde in front of digit", t => {
  t.is(
    s("## Tilde means approximately ~100"),
    "markdown-header-tilde-means-approximately-100",
    "32.01"
  );
});

test("32.02 - Single tilde in front of word", t => {
  t.is(s("## Tilde ~ here"), "markdown-header-tilde-here", "32.02");
});

test("32.03 - Tight tilde", t => {
  t.is(s("## tilde~tilde"), "markdown-header-tildetilde", "32.03");
});

// 33. Different languages
// -----------------------------------------------------------------------------

test("33.02 - Lithuanian", t => {
  t.is(
    s("## Some Lithuanian - Ąžuolynas"),
    "markdown-header-some-lithuanian-azuolynas",
    "33.02"
  );
});

test("33.02 - Russian language", t => {
  t.is(s("## Путин, Владимир Владимирович"), "markdown-header-", "33.02");
});

test("33.03 - Japanese language", t => {
  t.is(s("## Author 村上春樹"), "markdown-header-author", "33.03");
});

// 34. Currencies
// -----------------------------------------------------------------------------

test("34.01 - Pounds", t => {
  t.is(s("## Price is £10"), "markdown-header-price-is-10", "34.01");
});

test("34.02 - Dollars", t => {
  t.is(s("## Price is 100$"), "markdown-header-price-is-100", "34.02");
});

test("34.03 - Euros", t => {
  t.is(s("## Price is €10"), "markdown-header-price-is-10", "34.03");
});

// 35. Various
// -----------------------------------------------------------------------------

test("35.01 - Emoji in the headings", t => {
  t.is(s("## 🦄 Unicorn title"), "markdown-header-unicorn-title", "35.01");
});

test("35.02 - Emoji in the headings", t => {
  t.is(s("## ♥ Heart title"), "markdown-header-heart-title", "35.02");
});
