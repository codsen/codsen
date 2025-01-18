import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// import detergent from "../dist/detergent.esm.js";
// const det1 = detergent.det;
import { det, mixer } from "../t-util/util.js";
import {
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  // rawNbsp,
  // hairspace,
  // ellipsis,
  rightSingleQuote,
  rightDoubleQuote,
  leftDoubleQuote,
  leftSingleQuote,
} from "codsen-utils";

// -----------------------------------------------------------------------------

test("01 - converts single apostrophes - with entities", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "test's", opt).res,
      "test&rsquo;s",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("02 - converts single apostrophes - no entities", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "test's", opt).res,
      "test\u2019s",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("03 - doesn't convert single apostrophes", () => {
  mixer({
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "test's", opt).res,
      "test's",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("04 - converts quotation marks into fancy ones: +entities", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'this is "citation"', opt).res,
      "this is &ldquo;citation&rdquo;",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("05 - converts quotation marks into fancy ones: -entities", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'this is "citation"', opt).res,
      "this is \u201Ccitation\u201D",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("06 - doesn't convert quotation marks: -apostrophes-entities", () => {
  mixer({
    convertApostrophes: false,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'this is "citation"', opt).res,
      'this is "citation"',
      JSON.stringify(opt, null, 4),
    );
  });
});

test("07 - exclamation mark + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '"What!" he said', opt).res,
      `${leftDoubleQuote}What!${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("08 - full stop + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '"What." he said', opt).res,
      `${leftDoubleQuote}What.${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("09 - comma + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '"What," he said', opt).res,
      `${leftDoubleQuote}What,${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("10 - semicolon + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '"What;" he said', opt).res,
      `${leftDoubleQuote}What;${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("11 - question mark + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '"What?" he said', opt).res,
      `${leftDoubleQuote}What?${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("12 - exclamation mark + double quote + space", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'What!' he said", opt).res,
      `${leftSingleQuote}What!${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("13 - full stop + double quote + space", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'What.' he said", opt).res,
      `${leftSingleQuote}What.${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("14 - comma + double quote + space", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'What,' he said", opt).res,
      `${leftSingleQuote}What,${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("15 - semicolon + double quote + space", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'What;' he said", opt).res,
      `${leftSingleQuote}What;${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("16 - question mark + double quote + space", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'What?' he said", opt).res,
      `${leftSingleQuote}What?${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("17 - exclamation mark + single quote + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\"'What!'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What!${rightSingleQuote}${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("18 - full stop + single quote + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\"'What.'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What.${rightSingleQuote}${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("19 - comma + single quote + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\"'What,'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What,${rightSingleQuote}${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("20 - semicolon + single quote + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\"'What;'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What;${rightSingleQuote}${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("21 - question mark + single quote + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\"'What;'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What;${rightSingleQuote}${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("22 - exclamation mark + double quote + single quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'\"What!\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What!${rightDoubleQuote}${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("23 - full stop + double quote + single quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'\"What.\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What.${rightDoubleQuote}${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("24 - comma + double quote + single quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'\"What,\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What,${rightDoubleQuote}${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("25 - semicolon + double quote + single quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'\"What;\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What;${rightDoubleQuote}${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("26 - question mark + double quote + single quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'\"What?\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What?${rightDoubleQuote}${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4),
    );
  });
});

// Following unit tests adapted from:
// https://github.com/kemitchell/straight-to-curly-quotes.JSON.
// License CC0-1.0

test("27 - one word wrapped with double quotes", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '"Hello!"', opt).res,
      "“Hello!”",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("28 - single quote surrounded by letters", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "ain't", opt).res,
      "ain’t",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("29 - single quote surrounded by letters 2", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "ma'am", opt).res,
      "ma’am",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("30 - leading single quote", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'Twas the night", opt).res,
      `${rightSingleQuote}Twas the night`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("31 - mixed quotes within a single sentence", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '"Hello," said the spider. "\'Shelob\' is my name."', opt)
        .res,
      "“Hello,” said the spider. “‘Shelob’ is my name.”",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("32 - single letters wrapped with single quotes", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'A', 'B', and 'C' are letters.", opt).res,
      "‘A’, ‘B’, and ‘C’ are letters.",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("33 - words wrapped with single quotes", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "'Oak,' 'elm,' and 'beech' are names of trees. So is 'pine.'",
        opt,
      ).res,
      "‘Oak,’ ‘elm,’ and ‘beech’ are names of trees. So is ‘pine.’",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("34 - double quotes within single quotes", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "'He said, \"I want to go.\"' Were you alive in the 70's?",
        opt,
      ).res,
      "‘He said, “I want to go.”’ Were you alive in the 70’s?",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("35 - double quotes within single quotes", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\"That's a 'magic' sock.\"", opt).res,
      "“That’s a ‘magic’ sock.”",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("36 - double quotes within double quotes", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        'Welcome to Website Name! Company Name, Inc. ("Company Name" or "Company") recommends that you read the following terms and conditions carefully.',
        opt,
      ).res,
      "Welcome to Website Name! Company Name, Inc. (“Company Name” or “Company”) recommends that you read the following terms and conditions carefully.",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("37 - single quotes within double quotes", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Welcome to Website Name! Company Name, Inc. ('Company Name' or 'Company') recommends that you read the following terms and conditions carefully.",
        opt,
      ).res,
      "Welcome to Website Name! Company Name, Inc. (‘Company Name’ or ‘Company’) recommends that you read the following terms and conditions carefully.",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("38 - plural", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'85 was a good year. (The entire '80s were.)", opt).res,
      "’85 was a good year. (The entire ’80s were.)",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("39 - single quote in the end of a word", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Workin' hard", opt).res,
      "Workin’ hard",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("40 - single quote in the front of a word", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'Twas the night before Christmas.", opt).res,
      "’Twas the night before Christmas.",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("41 - single quote in the front of a word plus in the middle", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'Twasn't the night before Christmas.", opt).res,
      "’Twasn’t the night before Christmas.",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("42 - single quote in the front of a word plus in the middle", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'Tis the night before Christmas.", opt).res,
      "’Tis the night before Christmas.",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("43 - single quote in the front of a word plus in the middle", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'Tisn't the night before Christmas.", opt).res,
      "’Tisn’t the night before Christmas.",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("44 - single quote in the front of a string", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'Twill be the night before Christmas.", opt).res,
      `${rightSingleQuote}Twill be the night before Christmas.`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("45 - single quote in the front of a string", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'Twould be the night before Christmas.", opt).res,
      `${rightSingleQuote}Twould be the night before Christmas.`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("46 - single quote in the front of a string", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "'Twere the night before Christmas, I would be happy.",
        opt,
      ).res,
      "’Twere the night before Christmas, I would be happy.",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("47 - single quote in the front of a string", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "'Tweren't the night before Christmas, I would be happy.",
        opt,
      ).res,
      "’Tweren’t the night before Christmas, I would be happy.",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("48 - single quotes wrapping word, ending in the middle", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'Twon't be the night before Christmas.", opt).res,
      "’Twon’t be the night before Christmas.",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("49 - single quotes wrapping a word, ending in between words", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'70s are my favorite numbers,' she said.", opt).res,
      `${rightSingleQuote}70s are my favorite numbers,${rightSingleQuote} she said.`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("50 - single quote on years", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'70s fashion was weird.", opt).res,
      `${rightSingleQuote}70s fashion was weird.`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("51 - inches", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '12" record, 5\'10" height', opt).res,
      "12″ record, 5′10″ height",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("52 - word wrapped with double quotes in the end of a string", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'Model "T2000"', opt).res,
      `Model ${leftDoubleQuote}T2000${rightDoubleQuote}`,
      JSON.stringify(opt, null, 4),
    );
  });
});

test("53 - plural", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "iPad 3's battery life is not great.", opt).res,
      "iPad 3’s battery life is not great.",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("54 - plural", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "Book 'em, Danno. Rock 'n' roll. 'Cause 'twas the season.",
        opt,
      ).res,
      "Book ’em, Danno. Rock ’n’ roll. ’Cause ’twas the season.",
      JSON.stringify(opt, null, 4),
    );
  });
});

// Example from https://practicaltypography.com/apostrophes.html
test("55 - Buttericks example - on", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "In the '60s, rock 'n' roll", opt).res,
      "In the ’60s, rock ’n’ roll",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("56 - Buttericks example - off", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: false,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "In the '60s, rock 'n' roll", opt).res,
      "In the '60s, rock 'n' roll",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("57 - Hawaii - sets okina #1", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Hawai'i", opt).res,
      "Hawai‘i",
      JSON.stringify(opt, null, 4),
    );
  });
});

test("58 - Hawaii - sets okina #2", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "O'ahu", opt).res,
      "O‘ahu",
      JSON.stringify(opt, null, 4),
    );
  });
});

test.run();
