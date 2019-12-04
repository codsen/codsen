const t = require("tap");
const s = require("../dist/bitbucket-slug.cjs");

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

t.test("01.01 - empty input", t => {
  t.equal(s(), "", "01.01");
  t.end();
});
t.test("01.02 - number input", t => {
  t.equal(s(1), "", "01.02");
  t.end();
});
t.test("01.03 - null input", t => {
  t.equal(s(null), "", "01.03");
  t.end();
});
t.test("01.04 - undefined input", t => {
  t.equal(s(undefined), "", "01.04");
  t.end();
});
t.test("01.05 - Boolean input", t => {
  t.equal(s(true), "", "01.05");
  t.end();
});

// 02. No punctuation in the end
// -----------------------------------------------------------------------------

t.test("02.01 - h1 slug", t => {
  t.equal(
    s("# Let's backwards-engineer BitBucket anchor link slug algorithm"),
    "markdown-header-lets-backwards-engineer-bitbucket-anchor-link-slug-algorithm",
    "02.01"
  );
  t.end();
});

t.test("02.02 - There's a single word above, first capital", t => {
  t.equal(s("## Word"), "markdown-header-word", "02.02");
  t.end();
});

t.test("02.03 - There are two words above, first capital", t => {
  t.equal(s("## Two words"), "markdown-header-two-words", "02.03");
  t.end();
});

t.test("02.04 - Three words, first capital", t => {
  t.equal(
    s("## Three words here"),
    "markdown-header-three-words-here",
    "02.04"
  );
  t.end();
});

t.test("02.05 - There's a single word above, first lowercase", t => {
  t.equal(s("## word"), "markdown-header-word", "02.05");
  t.end();
});

t.test("02.06 - There are two words above, first lowercase", t => {
  t.equal(s("## two words"), "markdown-header-two-words", "02.06");
  t.end();
});

t.test("02.07 - Three words, first lowercase", t => {
  t.equal(
    s("## three words here"),
    "markdown-header-three-words-here",
    "02.07"
  );
  t.end();
});

// 03. Ends with full stop
// -----------------------------------------------------------------------------

t.test(
  "03.01 - There's a single word above, first capital, ends with full stop",
  t => {
    t.equal(s("## Word."), "markdown-header-word", "03.01");
    t.end();
  }
);

t.test(
  "03.02 - There are two words above, first capital, ends with full stop",
  t => {
    t.equal(s("## Two words."), "markdown-header-two-words", "03.02");
    t.end();
  }
);

t.test("03.03 - Three words, first capital, ends with full stop", t => {
  t.equal(
    s("## Three words here."),
    "markdown-header-three-words-here",
    "03.03"
  );
  t.end();
});

t.test(
  "03.04 - There's a single word above, first lowercase, ends with full stop",
  t => {
    t.equal(s("## word."), "markdown-header-word", "03.04");
    t.end();
  }
);

t.test(
  "03.05 - There are two words above, first lowercase, ends with full stop",
  t => {
    t.equal(s("## two words."), "markdown-header-two-words", "03.05");
    t.end();
  }
);

t.test("03.06 - Three words, first lowercase, ends with full stop", t => {
  t.equal(
    s("## three words here."),
    "markdown-header-three-words-here",
    "03.06"
  );
  t.end();
});

// 04. Question mark
// -----------------------------------------------------------------------------

t.test(
  "04.01 - There's a single word above, first capital, ends with full stop",
  t => {
    t.equal(s("## Word?"), "markdown-header-word", "04.01");
    t.end();
  }
);

t.test(
  "04.02 - There are two words above, first capital, ends with full stop",
  t => {
    t.equal(s("## Two words?"), "markdown-header-two-words", "04.02");
    t.end();
  }
);

t.test("04.03 - Three words, first capital, ends with full stop", t => {
  t.equal(
    s("## Three words here?"),
    "markdown-header-three-words-here",
    "04.03"
  );
  t.end();
});

t.test(
  "04.04 - There's a single word above, first lowercase, ends with full stop",
  t => {
    t.equal(s("## word?"), "markdown-header-word", "04.04");
    t.end();
  }
);

t.test(
  "04.05 - There are two words above, first lowercase, ends with full stop",
  t => {
    t.equal(s("## two words?"), "markdown-header-two-words", "04.05");
    t.end();
  }
);

t.test("04.06 - Three words, first lowercase, ends with full stop", t => {
  t.equal(
    s("## three words here?"),
    "markdown-header-three-words-here",
    "04.06"
  );
  t.end();
});

// 05. Exclamation mark
// -----------------------------------------------------------------------------

t.test(
  "05.01 - There's a single word above, first capital, ends with exclamation mark",
  t => {
    t.equal(s("## Word!"), "markdown-header-word", "05.01");
    t.end();
  }
);

t.test(
  "05.02 - There are two words above, first capital, ends with exclamation mark",
  t => {
    t.equal(s("## Two words!"), "markdown-header-two-words", "05.02");
    t.end();
  }
);

t.test("05.03 - Three words, first capital, ends with exclamation mark", t => {
  t.equal(
    s("## Three words here!"),
    "markdown-header-three-words-here",
    "05.03"
  );
  t.end();
});

t.test(
  "05.04 - There's a single word above, first lowercase, ends with exclamation mark",
  t => {
    t.equal(s("## word!"), "markdown-header-word", "05.04");
    t.end();
  }
);

t.test(
  "05.05 - There are two words above, first lowercase, ends with exclamation mark",
  t => {
    t.equal(s("## two words!"), "markdown-header-two-words", "05.05");
    t.end();
  }
);

t.test(
  "05.06 - Three words, first lowercase, ends with exclamation mark",
  t => {
    t.equal(
      s("## three words here!"),
      "markdown-header-three-words-here",
      "05.06"
    );
    t.end();
  }
);

// 06. Ellipsis
// -----------------------------------------------------------------------------

t.test(
  "06.01 - There's a single word above, first capital, ends with ellipsis",
  t => {
    t.equal(s("## Word..."), "markdown-header-word", "06.01");
    t.end();
  }
);

t.test(
  "06.02 - There are two words above, first capital, ends with ellipsis",
  t => {
    t.equal(s("## Two words..."), "markdown-header-two-words", "06.02");
    t.end();
  }
);

t.test("06.03 - Three words, first capital, ends with ellipsis", t => {
  t.equal(
    s("## Three words here..."),
    "markdown-header-three-words-here",
    "06.03"
  );
  t.end();
});

t.test(
  "06.04 - There's a single word above, first lowercase, ends with ellipsis",
  t => {
    t.equal(s("## word..."), "markdown-header-word", "06.04");
    t.end();
  }
);

t.test(
  "06.05 - There are two words above, first lowercase, ends with ellipsis",
  t => {
    t.equal(s("## two words..."), "markdown-header-two-words", "06.05");
    t.end();
  }
);

t.test("06.06 - Three words, first lowercase, ends with ellipsis", t => {
  t.equal(
    s("## three words here..."),
    "markdown-header-three-words-here",
    "06.06"
  );
  t.end();
});

// 07. Numbers
// -----------------------------------------------------------------------------

t.test("07.01 - Single number in the end", t => {
  t.equal(
    s("## Here is number 1"),
    "markdown-header-here-is-number-1",
    "07.01"
  );
  t.end();
});

t.test("07.01 - Whole h2 is single digit", t => {
  t.equal(s("## 1"), "markdown-header-1", "07.01");
  t.end();
});

t.test("07.01 - H2 starts with digit", t => {
  t.equal(s("## 1 title"), "markdown-header-1-title", "07.01");
  t.end();
});

t.test("07.01 - Digit and letter, no space", t => {
  t.equal(s("## 1st title"), "markdown-header-1st-title", "07.01");
  t.end();
});

t.test("07.01 - Three digits in the h2", t => {
  t.equal(s("## 111 title"), "markdown-header-111-title", "07.01");
  t.end();
});

// 08. Double quotes
// -----------------------------------------------------------------------------

t.test("08.01 - Word with double quotes ends the H2", t => {
  t.equal(
    s(`## So-called "music"`),
    "markdown-header-so-called-music",
    "08.01"
  );
  t.end();
});

t.test("08.02 - Double quotes mid-sentence", t => {
  t.equal(
    s(`## So-called "music" is being played`),
    "markdown-header-so-called-music-is-being-played",
    "08.02"
  );
  t.end();
});

t.test("08.03 - Double quotes starting the H2", t => {
  t.equal(
    s(`## "Music" is being played`),
    "markdown-header-music-is-being-played",
    "08.03"
  );
  t.end();
});

// 09. Hash

t.test("09.01 - Title starts with hash", t => {
  t.equal(s("## #hashtag"), "markdown-header-hashtag", "09.01");
  t.end();
});

t.test("09.01 - Title ends with word that starts with hash", t => {
  t.equal(
    s("## Let's tag the #hashtag"),
    "markdown-header-lets-tag-the-hashtag",
    "09.01"
  );
  t.end();
});

// 10. Dollar
// -----------------------------------------------------------------------------

t.test("10.01 - Title starts with dollar sign", t => {
  t.equal(s("## $100 dollars"), "markdown-header-100-dollars", "10.01");
  t.end();
});

t.test("10.02 - Title ends with single dollar sign", t => {
  t.equal(s("## Win some $"), "markdown-header-win-some", "10.02");
  t.end();
});

// 11. Percentage
// -----------------------------------------------------------------------------

t.test("11.01 - Percentage after word", t => {
  t.equal(s("## 25% cut"), "markdown-header-25-cut", "11.01");
  t.end();
});

t.test("11.02 - Percentage in the end", t => {
  t.equal(s("## cut %"), "markdown-header-cut", "11.02");
  t.end();
});

// 12. Ampersand
// -----------------------------------------------------------------------------

t.test("12.01 - Standalone ampersand", t => {
  t.equal(
    s("## Ampersand & ampersand"),
    "markdown-header-ampersand-ampersand",
    "12.01"
  );
  t.end();
});

t.test("12.02 - No space around ampersand", t => {
  t.equal(
    s("## Something&something"),
    "markdown-header-somethingsomething",
    "12.02"
  );
  t.end();
});

t.test("12.03 - Standalone ampersand", t => {
  t.equal(
    s("## Ampersand &amp; ampersand"),
    "markdown-header-ampersand-ampersand",
    "12.03 - encoded"
  );
  t.end();
});

t.test("12.04 - No space around ampersand", t => {
  t.equal(
    s("## Something&amp;something"),
    "markdown-header-somethingsomething",
    "12.04 - encoded"
  );
  t.end();
});

// 13. Single straight quote
// -----------------------------------------------------------------------------

t.test("13.01 - Single quote between letters", t => {
  t.equal(s("## Title's notation"), "markdown-header-titles-notation", "13.01");
  t.end();
});

t.test("13.02 - Single quote ends the H2", t => {
  t.equal(s("## Peoples'"), "markdown-header-peoples", "13.02");
  t.end();
});

// 14. Bracket
// -----------------------------------------------------------------------------

t.test("14.01 - Words with brackets", t => {
  t.equal(
    s("## Music (not this) is pleasure"),
    "markdown-header-music-not-this-is-pleasure",
    "14.01"
  );
  t.end();
});

t.test("14.02 - All H2 wrapped with brackets", t => {
  t.equal(s("## (Something)"), "markdown-header-something", "14.02");
  t.end();
});

// 15. Asterisk
// -----------------------------------------------------------------------------

t.test("15.01 - Asterisk in the end", t => {
  t.equal(s("## Something*"), "markdown-header-something", "15.01");
  t.end();
});

t.test("15.02 - Digits with asterisk, tight", t => {
  t.equal(s("## 2*2"), "markdown-header-22", "15.02");
  t.end();
});

t.test("15.03 - Asterisk surrounded by spaces", t => {
  t.equal(
    s("## Something * Something"),
    "markdown-header-something-something",
    "15.03"
  );
  t.end();
});

// 16. Plus
// -----------------------------------------------------------------------------

t.test("16.02 - Plus sign, spaces", t => {
  t.equal(
    s("## Something + anything"),
    "markdown-header-something-anything",
    "16.02"
  );
  t.end();
});

t.test("16.02 - Plus sign, tight", t => {
  t.equal(
    s("## Something+anything"),
    "markdown-header-somethinganything",
    "16.02"
  );
  t.end();
});

// 17. Comma
// -----------------------------------------------------------------------------

t.test("17.01 - Comma, space", t => {
  t.equal(
    s("## Something, anything"),
    "markdown-header-something-anything",
    "17.01"
  );
  t.end();
});

t.test("17.02 - Comma, no space", t => {
  t.equal(
    s("## Something,anything"),
    "markdown-header-somethinganything",
    "17.02"
  );
  t.end();
});

// 18. Slash
// -----------------------------------------------------------------------------

t.test("18.01 - Slash, no spaces", t => {
  t.equal(s("## Slash/dot"), "markdown-header-slashdot", "18.01");
  t.end();
});

t.test("18.02 - Slash with spaces", t => {
  t.equal(s("## Slash / dot"), "markdown-header-slash-dot", "18.02");
  t.end();
});

// 19. Digits
// -----------------------------------------------------------------------------

t.test("19.01 - All digits", t => {
  t.equal(
    s("## 1 2 3 4 5 6 7 8 9 0"),
    "markdown-header-1-2-3-4-5-6-7-8-9-0",
    "19.01"
  );
  t.end();
});

t.test("19.02 - All digits surrounded by letters", t => {
  t.equal(
    s("## aaa 1 2 3 4 5 6 7 8 9 0 bbb"),
    "markdown-header-aaa-1-2-3-4-5-6-7-8-9-0-bbb",
    "19.02"
  );
  t.end();
});

t.test("19.03 - All digits, no spaces", t => {
  t.equal(s("## 1234567890"), "markdown-header-1234567890", "19.03");
  t.end();
});

t.test("19.04 - All digits surrounded by letters, no spaces", t => {
  t.equal(
    s("## aaa1234567890bbb"),
    "markdown-header-aaa1234567890bbb",
    "19.04"
  );
  t.end();
});

// 20. Colon
// -----------------------------------------------------------------------------

t.test("20.01 - Colon follows the word in h2", t => {
  t.equal(
    s("## Colons: practical, useful and, of course, legible"),
    "markdown-header-colons-practical-useful-and-of-course-legible",
    "20.01"
  );
  t.end();
});

// 21. Semicolon
// -----------------------------------------------------------------------------

t.test("21.01 - Semicolon after word", t => {
  t.equal(
    s("## Semicolons; What not follows"),
    "markdown-header-semicolons-what-not-follows",
    "21.01"
  );
  t.end();
});

t.test("21.01 - Semicolon in the end", t => {
  t.equal(s("## Semicolons;"), "markdown-header-semicolons", "21.01");
  t.end();
});

// 22. Less than, greater than and equal signs
// -----------------------------------------------------------------------------

t.test("22.01 - Less than", t => {
  t.equal(s("## a < b"), "markdown-header-a-b", "22.01");
  t.end();
});

t.test("22.02 - Greater than", t => {
  t.equal(s("## a > b"), "markdown-header-a-b", "22.02");
  t.end();
});

t.test("22.03 - Single equal", t => {
  t.equal(s("## a = b"), "markdown-header-a-b", "22.03");
  t.end();
});

t.test("22.04 - Tripple equal, tight", t => {
  t.equal(s("## a===b"), "markdown-header-ab", "22.04");
  t.end();
});

t.test("22.05 - Tripple equal, spaced", t => {
  t.equal(s("## a === b"), "markdown-header-a-b", "22.05");
  t.end();
});

// 23. Question mark, revisited
// -----------------------------------------------------------------------------

t.test("23.01 - Question mark in the end", t => {
  t.equal(
    s("## What is the point of testing this?"),
    "markdown-header-what-is-the-point-of-testing-this",
    "23.01"
  );
  t.end();
});

t.test("23.02 - Two question marks in H2", t => {
  t.equal(
    s("## What? Don't we need to test?"),
    "markdown-header-what-dont-we-need-to-test",
    "23.02"
  );
  t.end();
});

// 24. At sign
// -----------------------------------------------------------------------------

t.test("24.01 - Email address in the H2", t => {
  t.equal(
    s("## Email is: roy@domain.com"),
    "markdown-header-email-is-roydomaincom",
    "24.01"
  );
  t.end();
});

t.test("24.02 - @ sign surrounded with spaces", t => {
  t.equal(
    s("## Something @ something"),
    "markdown-header-something-something",
    "24.02"
  );
  t.end();
});

// 25. Link in the H tag
// -----------------------------------------------------------------------------

t.test("25.01 - Link in the H2", t => {
  t.equal(
    s("## [Something](https://codsen.com) link"),
    "markdown-header-something-link",
    "25.01"
  );
  t.end();
});

// 26. Left slash
// -----------------------------------------------------------------------------

t.test("26.01 - Left slash", t => {
  t.equal(s("## Left slash  here"), "markdown-header-left-slash-here", "26.01");
  t.end();
});

// 27. Caret
// -----------------------------------------------------------------------------

t.test("27.01 - Caret, tight", t => {
  t.equal(s("## Something^"), "markdown-header-something", "27.01");
  t.end();
});

t.test("27.02 - Caret, with space", t => {
  t.equal(s("## Something ^"), "markdown-header-something", "27.02");
  t.end();
});

// 28. Underscore
// -----------------------------------------------------------------------------

t.test("28.01 - Underscore between letters", t => {
  t.equal(s("## snake_case"), "markdown-header-snake_case", "28.01");
  t.end();
});

t.test("28.02 - Underscore surrounded by spaces", t => {
  t.equal(
    s("## something _ something"),
    "markdown-header-something-_-something",
    "28.02"
  );
  t.end();
});

// 29. Backtick
// -----------------------------------------------------------------------------

t.test("29.01 - Starts with backtick", t => {
  t.equal(
    s("## `variable` is in the beginning"),
    "markdown-header-variable-is-in-the-beginning",
    "29.01"
  );
  t.end();
});

t.test("29.02 - Middle", t => {
  t.equal(
    s("## Middle `variable` is here"),
    "markdown-header-middle-variable-is-here",
    "29.02"
  );
  t.end();
});

t.test("29.03 - Backtick in the end of H2", t => {
  t.equal(
    s("## Ends with `variable`"),
    "markdown-header-ends-with-variable",
    "29.03"
  );
  t.end();
});

// 30. Curly braces
// -----------------------------------------------------------------------------

t.test("30.01 - Curly braces", t => {
  t.equal(
    s("## Curlies {like this}"),
    "markdown-header-curlies-like-this",
    "30.01"
  );
  t.end();
});

t.test("30.02 - And with spaces", t => {
  t.equal(
    s("## Curlies { and like this }"),
    "markdown-header-curlies-and-like-this",
    "30.02"
  );
  t.end();
});

// 31. Pipe character
// -----------------------------------------------------------------------------

t.test("31.01 - Single pipe", t => {
  t.equal(s("## Pipe character |"), "markdown-header-pipe-character", "31.01");
  t.end();
});

t.test("31.02 - Double pipe", t => {
  t.equal(
    s(`## Something || something means "or"`),
    "markdown-header-something-something-means-or",
    "31.02"
  );
  t.end();
});

// 32. Tilde
// -----------------------------------------------------------------------------

t.test("32.01 - Single tilde in front of digit", t => {
  t.equal(
    s("## Tilde means approximately ~100"),
    "markdown-header-tilde-means-approximately-100",
    "32.01"
  );
  t.end();
});

t.test("32.02 - Single tilde in front of word", t => {
  t.equal(s("## Tilde ~ here"), "markdown-header-tilde-here", "32.02");
  t.end();
});

t.test("32.03 - Tight tilde", t => {
  t.equal(s("## tilde~tilde"), "markdown-header-tildetilde", "32.03");
  t.end();
});

// 33. Different languages
// -----------------------------------------------------------------------------

t.test("33.02 - Lithuanian", t => {
  t.equal(
    s("## Some Lithuanian - Ąžuolynas"),
    "markdown-header-some-lithuanian-azuolynas",
    "33.02"
  );
  t.end();
});

t.test("33.02 - Russian language", t => {
  t.equal(s("## Путин, Владимир Владимирович"), "markdown-header-", "33.02");
  t.end();
});

t.test("33.03 - Japanese language", t => {
  t.equal(s("## Author 村上春樹"), "markdown-header-author", "33.03");
  t.end();
});

// 34. Currencies
// -----------------------------------------------------------------------------

t.test("34.01 - Pounds", t => {
  t.equal(s("## Price is £10"), "markdown-header-price-is-10", "34.01");
  t.end();
});

t.test("34.02 - Dollars", t => {
  t.equal(s("## Price is 100$"), "markdown-header-price-is-100", "34.02");
  t.end();
});

t.test("34.03 - Euros", t => {
  t.equal(s("## Price is €10"), "markdown-header-price-is-10", "34.03");
  t.end();
});

// 35. Various
// -----------------------------------------------------------------------------

t.test("35.01 - Emoji in the headings", t => {
  t.equal(s("## 🦄 Unicorn title"), "markdown-header-unicorn-title", "35.01");
  t.end();
});

t.test("35.02 - Emoji in the headings", t => {
  t.equal(s("## ♥ Heart title"), "markdown-header-heart-title", "35.02");
  t.end();
});

t.test("35.03 - Multiple consecutive dashes surrounded by spaces", t => {
  t.equal(
    s("## Title -- is the best"),
    "markdown-header-title-is-the-best",
    "35.03.01"
  );
  t.equal(
    s("## Title --- is the best"),
    "markdown-header-title-is-the-best",
    "35.03.02"
  );
  t.end();
});

t.test("35.04 - A bug from real life, #1", t => {
  t.equal(
    s(
      "## Example - treating the image alt attributes - Gulp and stream-tapping"
    ),
    "markdown-header-example-treating-the-image-alt-attributes-gulp-and-stream-tapping",
    "35.04"
  );
  t.end();
});
