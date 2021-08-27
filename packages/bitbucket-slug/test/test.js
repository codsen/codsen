import tap from "tap";
import { bSlug as s } from "../dist/bitbucket-slug.esm.js";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

tap.test("01 - empty input", (t) => {
  t.equal(s(), "", "01");
  t.end();
});
tap.test("02 - number input", (t) => {
  t.equal(s(1), "", "02");
  t.end();
});
tap.test("03 - null input", (t) => {
  t.equal(s(null), "", "03");
  t.end();
});
tap.test("04 - undefined input", (t) => {
  t.equal(s(undefined), "", "04");
  t.end();
});
tap.test("05 - Boolean input", (t) => {
  t.equal(s(true), "", "05");
  t.end();
});

// 02. No punctuation in the end
// -----------------------------------------------------------------------------

tap.test("06 - h1 slug", (t) => {
  t.equal(
    s("# Let's backwards-engineer BitBucket anchor link slug algorithm"),
    "markdown-header-lets-backwards-engineer-bitbucket-anchor-link-slug-algorithm",
    "06"
  );
  t.end();
});

tap.test("07 - There's a single word above, first capital", (t) => {
  t.equal(s("## Word"), "markdown-header-word", "07");
  t.end();
});

tap.test("08 - There are two words above, first capital", (t) => {
  t.equal(s("## Two words"), "markdown-header-two-words", "08");
  t.end();
});

tap.test("09 - Three words, first capital", (t) => {
  t.equal(s("## Three words here"), "markdown-header-three-words-here", "09");
  t.end();
});

tap.test("10 - There's a single word above, first lowercase", (t) => {
  t.equal(s("## word"), "markdown-header-word", "10");
  t.end();
});

tap.test("11 - There are two words above, first lowercase", (t) => {
  t.equal(s("## two words"), "markdown-header-two-words", "11");
  t.end();
});

tap.test("12 - Three words, first lowercase", (t) => {
  t.equal(s("## three words here"), "markdown-header-three-words-here", "12");
  t.end();
});

// 03. Ends with full stop
// -----------------------------------------------------------------------------

tap.test(
  "13 - There's a single word above, first capital, ends with full stop",
  (t) => {
    t.equal(s("## Word."), "markdown-header-word", "13");
    t.end();
  }
);

tap.test(
  "14 - There are two words above, first capital, ends with full stop",
  (t) => {
    t.equal(s("## Two words."), "markdown-header-two-words", "14");
    t.end();
  }
);

tap.test("15 - Three words, first capital, ends with full stop", (t) => {
  t.equal(s("## Three words here."), "markdown-header-three-words-here", "15");
  t.end();
});

tap.test(
  "16 - There's a single word above, first lowercase, ends with full stop",
  (t) => {
    t.equal(s("## word."), "markdown-header-word", "16");
    t.end();
  }
);

tap.test(
  "17 - There are two words above, first lowercase, ends with full stop",
  (t) => {
    t.equal(s("## two words."), "markdown-header-two-words", "17");
    t.end();
  }
);

tap.test("18 - Three words, first lowercase, ends with full stop", (t) => {
  t.equal(s("## three words here."), "markdown-header-three-words-here", "18");
  t.end();
});

// 04. Question mark
// -----------------------------------------------------------------------------

tap.test(
  "19 - There's a single word above, first capital, ends with full stop",
  (t) => {
    t.equal(s("## Word?"), "markdown-header-word", "19");
    t.end();
  }
);

tap.test(
  "20 - There are two words above, first capital, ends with full stop",
  (t) => {
    t.equal(s("## Two words?"), "markdown-header-two-words", "20");
    t.end();
  }
);

tap.test("21 - Three words, first capital, ends with full stop", (t) => {
  t.equal(s("## Three words here?"), "markdown-header-three-words-here", "21");
  t.end();
});

tap.test(
  "22 - There's a single word above, first lowercase, ends with full stop",
  (t) => {
    t.equal(s("## word?"), "markdown-header-word", "22");
    t.end();
  }
);

tap.test(
  "23 - There are two words above, first lowercase, ends with full stop",
  (t) => {
    t.equal(s("## two words?"), "markdown-header-two-words", "23");
    t.end();
  }
);

tap.test("24 - Three words, first lowercase, ends with full stop", (t) => {
  t.equal(s("## three words here?"), "markdown-header-three-words-here", "24");
  t.end();
});

// 05. Exclamation mark
// -----------------------------------------------------------------------------

tap.test(
  "25 - There's a single word above, first capital, ends with exclamation mark",
  (t) => {
    t.equal(s("## Word!"), "markdown-header-word", "25");
    t.end();
  }
);

tap.test(
  "26 - There are two words above, first capital, ends with exclamation mark",
  (t) => {
    t.equal(s("## Two words!"), "markdown-header-two-words", "26");
    t.end();
  }
);

tap.test("27 - Three words, first capital, ends with exclamation mark", (t) => {
  t.equal(s("## Three words here!"), "markdown-header-three-words-here", "27");
  t.end();
});

tap.test(
  "28 - There's a single word above, first lowercase, ends with exclamation mark",
  (t) => {
    t.equal(s("## word!"), "markdown-header-word", "28");
    t.end();
  }
);

tap.test(
  "29 - There are two words above, first lowercase, ends with exclamation mark",
  (t) => {
    t.equal(s("## two words!"), "markdown-header-two-words", "29");
    t.end();
  }
);

tap.test(
  "30 - Three words, first lowercase, ends with exclamation mark",
  (t) => {
    t.equal(
      s("## three words here!"),
      "markdown-header-three-words-here",
      "30"
    );
    t.end();
  }
);

// 06. Ellipsis
// -----------------------------------------------------------------------------

tap.test(
  "31 - There's a single word above, first capital, ends with ellipsis",
  (t) => {
    t.equal(s("## Word..."), "markdown-header-word", "31");
    t.end();
  }
);

tap.test(
  "32 - There are two words above, first capital, ends with ellipsis",
  (t) => {
    t.equal(s("## Two words..."), "markdown-header-two-words", "32");
    t.end();
  }
);

tap.test("33 - Three words, first capital, ends with ellipsis", (t) => {
  t.equal(
    s("## Three words here..."),
    "markdown-header-three-words-here",
    "33"
  );
  t.end();
});

tap.test(
  "34 - There's a single word above, first lowercase, ends with ellipsis",
  (t) => {
    t.equal(s("## word..."), "markdown-header-word", "34");
    t.end();
  }
);

tap.test(
  "35 - There are two words above, first lowercase, ends with ellipsis",
  (t) => {
    t.equal(s("## two words..."), "markdown-header-two-words", "35");
    t.end();
  }
);

tap.test("36 - Three words, first lowercase, ends with ellipsis", (t) => {
  t.equal(
    s("## three words here..."),
    "markdown-header-three-words-here",
    "36"
  );
  t.end();
});

// 07. Numbers
// -----------------------------------------------------------------------------

tap.test("37 - Single number in the end", (t) => {
  t.equal(s("## Here is number 1"), "markdown-header-here-is-number-1", "37");
  t.end();
});

tap.test("38 - Whole h2 is single digit", (t) => {
  t.equal(s("## 1"), "markdown-header-1", "38");
  t.end();
});

tap.test("39 - H2 starts with digit", (t) => {
  t.equal(s("## 1 title"), "markdown-header-1-title", "39");
  t.end();
});

tap.test("40 - Digit and letter, no space", (t) => {
  t.equal(s("## 1st title"), "markdown-header-1st-title", "40");
  t.end();
});

tap.test("41 - Three digits in the h2", (t) => {
  t.equal(s("## 111 title"), "markdown-header-111-title", "41");
  t.end();
});

// 08. Double quotes
// -----------------------------------------------------------------------------

tap.test("42 - Word with double quotes ends the H2", (t) => {
  t.equal(s(`## So-called "music"`), "markdown-header-so-called-music", "42");
  t.end();
});

tap.test("43 - Double quotes mid-sentence", (t) => {
  t.equal(
    s(`## So-called "music" is being played`),
    "markdown-header-so-called-music-is-being-played",
    "43"
  );
  t.end();
});

tap.test("44 - Double quotes starting the H2", (t) => {
  t.equal(
    s(`## "Music" is being played`),
    "markdown-header-music-is-being-played",
    "44"
  );
  t.end();
});

// 09. Hash

tap.test("45 - Title starts with hash", (t) => {
  t.equal(s("## #hashtag"), "markdown-header-hashtag", "45");
  t.end();
});

tap.test("46 - Title ends with word that starts with hash", (t) => {
  t.equal(
    s("## Let's tag the #hashtag"),
    "markdown-header-lets-tag-the-hashtag",
    "46"
  );
  t.end();
});

// 10. Dollar
// -----------------------------------------------------------------------------

tap.test("47 - Title starts with dollar sign", (t) => {
  t.equal(s("## $100 dollars"), "markdown-header-100-dollars", "47");
  t.end();
});

tap.test("48 - Title ends with single dollar sign", (t) => {
  t.equal(s("## Win some $"), "markdown-header-win-some", "48");
  t.end();
});

// 11. Percentage
// -----------------------------------------------------------------------------

tap.test("49 - Percentage after word", (t) => {
  t.equal(s("## 25% cut"), "markdown-header-25-cut", "49");
  t.end();
});

tap.test("50 - Percentage in the end", (t) => {
  t.equal(s("## cut %"), "markdown-header-cut", "50");
  t.end();
});

// 12. Ampersand
// -----------------------------------------------------------------------------

tap.test("51 - Standalone ampersand", (t) => {
  t.equal(
    s("## Ampersand & ampersand"),
    "markdown-header-ampersand-ampersand",
    "51"
  );
  t.end();
});

tap.test("52 - No space around ampersand", (t) => {
  t.equal(
    s("## Something&something"),
    "markdown-header-somethingsomething",
    "52"
  );
  t.end();
});

// 13. Single straight quote
// -----------------------------------------------------------------------------

tap.test("53 - Single quote between letters", (t) => {
  t.equal(s("## Title's notation"), "markdown-header-titles-notation", "53");
  t.end();
});

tap.test("54 - Single quote ends the H2", (t) => {
  t.equal(s("## Peoples'"), "markdown-header-peoples", "54");
  t.end();
});

// 14. Bracket
// -----------------------------------------------------------------------------

tap.test("55 - Words with brackets", (t) => {
  t.equal(
    s("## Music (not this) is pleasure"),
    "markdown-header-music-not-this-is-pleasure",
    "55"
  );
  t.end();
});

tap.test("56 - All H2 wrapped with brackets", (t) => {
  t.equal(s("## (Something)"), "markdown-header-something", "56");
  t.end();
});

// 15. Asterisk
// -----------------------------------------------------------------------------

tap.test("57 - Asterisk in the end", (t) => {
  t.equal(s("## Something*"), "markdown-header-something", "57");
  t.end();
});

tap.test("58 - Digits with asterisk, tight", (t) => {
  t.equal(s("## 2*2"), "markdown-header-22", "58");
  t.end();
});

tap.test("59 - Asterisk surrounded by spaces", (t) => {
  t.equal(
    s("## Something * Something"),
    "markdown-header-something-something",
    "59"
  );
  t.end();
});

// 16. Plus
// -----------------------------------------------------------------------------

tap.test("60 - Plus sign, spaces", (t) => {
  t.equal(
    s("## Something + anything"),
    "markdown-header-something-anything",
    "60"
  );
  t.end();
});

tap.test("61 - Plus sign, tight", (t) => {
  t.equal(
    s("## Something+anything"),
    "markdown-header-somethinganything",
    "61"
  );
  t.end();
});

// 17. Comma
// -----------------------------------------------------------------------------

tap.test("62 - Comma, space", (t) => {
  t.equal(
    s("## Something, anything"),
    "markdown-header-something-anything",
    "62"
  );
  t.end();
});

tap.test("63 - Comma, no space", (t) => {
  t.equal(
    s("## Something,anything"),
    "markdown-header-somethinganything",
    "63"
  );
  t.end();
});

// 18. Slash
// -----------------------------------------------------------------------------

tap.test("64 - Slash, no spaces", (t) => {
  t.equal(s("## Slash/dot"), "markdown-header-slashdot", "64");
  t.end();
});

tap.test("65 - Slash with spaces", (t) => {
  t.equal(s("## Slash / dot"), "markdown-header-slash-dot", "65");
  t.end();
});

// 19. Digits
// -----------------------------------------------------------------------------

tap.test("66 - All digits", (t) => {
  t.equal(
    s("## 1 2 3 4 5 6 7 8 9 0"),
    "markdown-header-1-2-3-4-5-6-7-8-9-0",
    "66"
  );
  t.end();
});

tap.test("67 - All digits surrounded by letters", (t) => {
  t.equal(
    s("## aaa 1 2 3 4 5 6 7 8 9 0 bbb"),
    "markdown-header-aaa-1-2-3-4-5-6-7-8-9-0-bbb",
    "67"
  );
  t.end();
});

tap.test("68 - All digits, no spaces", (t) => {
  t.equal(s("## 1234567890"), "markdown-header-1234567890", "68");
  t.end();
});

tap.test("69 - All digits surrounded by letters, no spaces", (t) => {
  t.equal(s("## aaa1234567890bbb"), "markdown-header-aaa1234567890bbb", "69");
  t.end();
});

// 20. Colon
// -----------------------------------------------------------------------------

tap.test("70 - Colon follows the word in h2", (t) => {
  t.equal(
    s("## Colons: practical, useful and, of course, legible"),
    "markdown-header-colons-practical-useful-and-of-course-legible",
    "70"
  );
  t.end();
});

// 21. Semicolon
// -----------------------------------------------------------------------------

tap.test("71 - Semicolon after word", (t) => {
  t.equal(
    s("## Semicolons; What not follows"),
    "markdown-header-semicolons-what-not-follows",
    "71"
  );
  t.end();
});

tap.test("72 - Semicolon in the end", (t) => {
  t.equal(s("## Semicolons;"), "markdown-header-semicolons", "72");
  t.end();
});

// 22. Less than, greater than and equal signs
// -----------------------------------------------------------------------------

tap.test("73 - Less than", (t) => {
  t.equal(s("## a < b"), "markdown-header-a-b", "73");
  t.end();
});

tap.test("74 - Greater than", (t) => {
  t.equal(s("## a > b"), "markdown-header-a-b", "74");
  t.end();
});

tap.test("75 - Single equal", (t) => {
  t.equal(s("## a = b"), "markdown-header-a-b", "75");
  t.end();
});

tap.test("76 - Tripple equal, tight", (t) => {
  t.equal(s("## a===b"), "markdown-header-ab", "76");
  t.end();
});

tap.test("77 - Tripple equal, spaced", (t) => {
  t.equal(s("## a === b"), "markdown-header-a-b", "77");
  t.end();
});

// 23. Question mark, revisited
// -----------------------------------------------------------------------------

tap.test("78 - Question mark in the end", (t) => {
  t.equal(
    s("## What is the point of testing this?"),
    "markdown-header-what-is-the-point-of-testing-this",
    "78"
  );
  t.end();
});

tap.test("79 - Two question marks in H2", (t) => {
  t.equal(
    s("## What? Don't we need to test?"),
    "markdown-header-what-dont-we-need-to-test",
    "79"
  );
  t.end();
});

// 24. At sign
// -----------------------------------------------------------------------------

tap.test("80 - Email address in the H2", (t) => {
  t.equal(
    s("## Email is: roy@domain.com"),
    "markdown-header-email-is-roydomaincom",
    "80"
  );
  t.end();
});

tap.test("81 - @ sign surrounded with spaces", (t) => {
  t.equal(
    s("## Something @ something"),
    "markdown-header-something-something",
    "81"
  );
  t.end();
});

// 25. Link in the H tag
// -----------------------------------------------------------------------------

tap.test("82 - Link in the H2", (t) => {
  t.equal(
    s("## [Something](https://codsen.com) link"),
    "markdown-header-something-link",
    "82"
  );
  t.end();
});

// 26. Left slash
// -----------------------------------------------------------------------------

tap.test("83 - Left slash", (t) => {
  t.equal(s("## Left slash  here"), "markdown-header-left-slash-here", "83");
  t.end();
});

// 27. Caret
// -----------------------------------------------------------------------------

tap.test("84 - Caret, tight", (t) => {
  t.equal(s("## Something^"), "markdown-header-something", "84");
  t.end();
});

tap.test("85 - Caret, with space", (t) => {
  t.equal(s("## Something ^"), "markdown-header-something", "85");
  t.end();
});

// 28. Underscore
// -----------------------------------------------------------------------------

tap.test("86 - Underscore between letters", (t) => {
  t.equal(s("## snake_case"), "markdown-header-snake_case", "86");
  t.end();
});

tap.test("87 - Underscore surrounded by spaces", (t) => {
  t.equal(
    s("## something _ something"),
    "markdown-header-something-_-something",
    "87"
  );
  t.end();
});

// 29. Backtick
// -----------------------------------------------------------------------------

tap.test("88 - Starts with backtick", (t) => {
  t.equal(
    s("## `variable` is in the beginning"),
    "markdown-header-variable-is-in-the-beginning",
    "88"
  );
  t.end();
});

tap.test("89 - Middle", (t) => {
  t.equal(
    s("## Middle `variable` is here"),
    "markdown-header-middle-variable-is-here",
    "89"
  );
  t.end();
});

tap.test("90 - Backtick in the end of H2", (t) => {
  t.equal(
    s("## Ends with `variable`"),
    "markdown-header-ends-with-variable",
    "90"
  );
  t.end();
});

// 30. Curly braces
// -----------------------------------------------------------------------------

tap.test("91 - Curly braces", (t) => {
  t.equal(
    s("## Curlies {like this}"),
    "markdown-header-curlies-like-this",
    "91"
  );
  t.end();
});

tap.test("92 - And with spaces", (t) => {
  t.equal(
    s("## Curlies { and like this }"),
    "markdown-header-curlies-and-like-this",
    "92"
  );
  t.end();
});

// 31. Pipe character
// -----------------------------------------------------------------------------

tap.test("93 - Single pipe", (t) => {
  t.equal(s("## Pipe character |"), "markdown-header-pipe-character", "93");
  t.end();
});

tap.test("94 - Double pipe", (t) => {
  t.equal(
    s(`## Something || something means "or"`),
    "markdown-header-something-something-means-or",
    "94"
  );
  t.end();
});

// 32. Tilde
// -----------------------------------------------------------------------------

tap.test("95 - Single tilde in front of digit", (t) => {
  t.equal(
    s("## Tilde means approximately ~100"),
    "markdown-header-tilde-means-approximately-100",
    "95"
  );
  t.end();
});

tap.test("96 - Single tilde in front of word", (t) => {
  t.equal(s("## Tilde ~ here"), "markdown-header-tilde-here", "96");
  t.end();
});

tap.test("97 - Tight tilde", (t) => {
  t.equal(s("## tilde~tilde"), "markdown-header-tildetilde", "97");
  t.end();
});

// 33. Different languages
// -----------------------------------------------------------------------------

tap.test("98 - Lithuanian", (t) => {
  t.equal(
    s("## Some Lithuanian - Ąžuolynas"),
    "markdown-header-some-lithuanian-azuolynas",
    "98"
  );
  t.end();
});

tap.test("99 - Russian language", (t) => {
  t.equal(s("## Путин, Владимир Владимирович"), "markdown-header-", "99");
  t.end();
});

tap.test("100 - Japanese language", (t) => {
  t.equal(s("## Author 村上春樹"), "markdown-header-author", "100");
  t.end();
});

// 34. Currencies
// -----------------------------------------------------------------------------

tap.test("101 - Pounds", (t) => {
  t.equal(s("## Price is £10"), "markdown-header-price-is-10", "101");
  t.end();
});

tap.test("102 - Dollars", (t) => {
  t.equal(s("## Price is 100$"), "markdown-header-price-is-100", "102");
  t.end();
});

tap.test("103 - Euros", (t) => {
  t.equal(s("## Price is €10"), "markdown-header-price-is-10", "103");
  t.end();
});

// 35. Various
// -----------------------------------------------------------------------------

tap.test("104 - Emoji in the headings", (t) => {
  t.equal(s("## 🦄 Unicorn title"), "markdown-header-unicorn-title", "104");
  t.end();
});

tap.test("105 - Emoji in the headings", (t) => {
  t.equal(s("## ♥ Heart title"), "markdown-header-heart-title", "105");
  t.end();
});

tap.test("106 - Multiple consecutive dashes surrounded by spaces", (t) => {
  t.equal(
    s("## Title -- is the best"),
    "markdown-header-title-is-the-best",
    "106.01"
  );
  t.equal(
    s("## Title --- is the best"),
    "markdown-header-title-is-the-best",
    "106.02"
  );
  t.end();
});

tap.test("107 - A bug from real life, #1", (t) => {
  t.equal(
    s(
      "## Example - treating the image alt attributes - Gulp and stream-tapping"
    ),
    "markdown-header-example-treating-the-image-alt-attributes-gulp-and-stream-tapping",
    "107"
  );
  t.end();
});
