// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import {
  leftDoubleQuote,
  leftSingleQuote,
  rightDoubleQuote,
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  // rawNbsp,
  // hairspace,
  // ellipsis,
  rightSingleQuote,
} from "codsen-utils";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
// import detergent from "../dist/detergent.esm.js";
// const det1 = detergent.det;
import { det, mixer } from "../t-util/util.js";

// -----------------------------------------------------------------------------

test("001 - converts single apostrophes - with entities", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "test's", opt).res,
      "test&rsquo;s",
      `001.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("002 - converts single apostrophes - no entities", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "test's", opt).res,
      "test\u2019s",
      `002.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("003 - doesn't convert single apostrophes", () => {
  mixer({
    convertApostrophes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "test's", opt).res,
      "test's",
      `003.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("004 - converts quotation marks into fancy ones: +entities", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'this is "citation"', opt).res,
      "this is &ldquo;citation&rdquo;",
      `004.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("005 - converts quotation marks into fancy ones: -entities", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'this is "citation"', opt).res,
      "this is \u201Ccitation\u201D",
      `005.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("006 - doesn't convert quotation marks: -apostrophes-entities", () => {
  mixer({
    convertApostrophes: false,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'this is "citation"', opt).res,
      'this is "citation"',
      `006.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("007 - exclamation mark + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '"What!" he said', opt).res,
      `${leftDoubleQuote}What!${rightDoubleQuote} he said`,
      `007.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("008 - full stop + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '"What." he said', opt).res,
      `${leftDoubleQuote}What.${rightDoubleQuote} he said`,
      `008.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("009 - comma + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '"What," he said', opt).res,
      `${leftDoubleQuote}What,${rightDoubleQuote} he said`,
      `009.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("010 - semicolon + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '"What;" he said', opt).res,
      `${leftDoubleQuote}What;${rightDoubleQuote} he said`,
      `010.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("011 - question mark + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '"What?" he said', opt).res,
      `${leftDoubleQuote}What?${rightDoubleQuote} he said`,
      `011.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("012 - exclamation mark + double quote + space", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'What!' he said", opt).res,
      `${leftSingleQuote}What!${rightSingleQuote} he said`,
      `012.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("013 - full stop + double quote + space", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'What.' he said", opt).res,
      `${leftSingleQuote}What.${rightSingleQuote} he said`,
      `013.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("014 - comma + double quote + space", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'What,' he said", opt).res,
      `${leftSingleQuote}What,${rightSingleQuote} he said`,
      `014.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("015 - semicolon + double quote + space", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'What;' he said", opt).res,
      `${leftSingleQuote}What;${rightSingleQuote} he said`,
      `015.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("016 - question mark + double quote + space", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'What?' he said", opt).res,
      `${leftSingleQuote}What?${rightSingleQuote} he said`,
      `016.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("017 - exclamation mark + single quote + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\"'What!'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What!${rightSingleQuote}${rightDoubleQuote} he said`,
      `017.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("018 - full stop + single quote + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\"'What.'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What.${rightSingleQuote}${rightDoubleQuote} he said`,
      `018.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("019 - comma + single quote + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\"'What,'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What,${rightSingleQuote}${rightDoubleQuote} he said`,
      `019.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("020 - semicolon + single quote + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\"'What;'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What;${rightSingleQuote}${rightDoubleQuote} he said`,
      `020.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("021 - question mark + single quote + double quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\"'What;'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What;${rightSingleQuote}${rightDoubleQuote} he said`,
      `021.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("022 - exclamation mark + double quote + single quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'\"What!\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What!${rightDoubleQuote}${rightSingleQuote} he said`,
      `022.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("023 - full stop + double quote + single quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'\"What.\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What.${rightDoubleQuote}${rightSingleQuote} he said`,
      `023.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("024 - comma + double quote + single quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'\"What,\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What,${rightDoubleQuote}${rightSingleQuote} he said`,
      `024.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("025 - semicolon + double quote + single quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'\"What;\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What;${rightDoubleQuote}${rightSingleQuote} he said`,
      `025.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("026 - question mark + double quote + single quote", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'\"What?\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What?${rightDoubleQuote}${rightSingleQuote} he said`,
      `026.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

// Following unit tests adapted from:
// https://github.com/kemitchell/straight-to-curly-quotes.JSON.
// License CC0-1.0

test("027 - one word wrapped with double quotes", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '"Hello!"', opt).res,
      "“Hello!”",
      `027.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("028 - single quote surrounded by letters", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "ain't", opt).res,
      "ain’t",
      `028.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("029 - single quote surrounded by letters 2", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "ma'am", opt).res,
      "ma’am",
      `029.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("030 - leading single quote", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'Twas the night", opt).res,
      `${rightSingleQuote}Twas the night`,
      `030.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("031 - mixed quotes within a single sentence", () => {
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
      `031.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("032 - single letters wrapped with single quotes", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'A', 'B', and 'C' are letters.", opt).res,
      "‘A’, ‘B’, and ‘C’ are letters.",
      `032.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("033 - words wrapped with single quotes", () => {
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
      `033.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("034 - double quotes within single quotes", () => {
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
      `034.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("035 - double quotes within single quotes", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "\"That's a 'magic' sock.\"", opt).res,
      "“That’s a ‘magic’ sock.”",
      `035.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("036 - double quotes within double quotes", () => {
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
      `036.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("037 - single quotes within double quotes", () => {
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
      `037.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("038 - plural", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'85 was a good year. (The entire '80s were.)", opt).res,
      "’85 was a good year. (The entire ’80s were.)",
      `038.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("039 - single quote in the end of a word", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Workin' hard", opt).res,
      "Workin’ hard",
      `039.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("040 - single quote in the front of a word", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'Twas the night before Christmas.", opt).res,
      "’Twas the night before Christmas.",
      `040.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("041 - single quote in the front of a word plus in the middle", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'Twasn't the night before Christmas.", opt).res,
      "’Twasn’t the night before Christmas.",
      `041.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("042 - single quote in the front of a word plus in the middle", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'Tis the night before Christmas.", opt).res,
      "’Tis the night before Christmas.",
      `042.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("043 - single quote in the front of a word plus in the middle", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'Tisn't the night before Christmas.", opt).res,
      "’Tisn’t the night before Christmas.",
      `043.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("044 - single quote in the front of a string", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'Twill be the night before Christmas.", opt).res,
      `${rightSingleQuote}Twill be the night before Christmas.`,
      `044.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("045 - single quote in the front of a string", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'Twould be the night before Christmas.", opt).res,
      `${rightSingleQuote}Twould be the night before Christmas.`,
      `045.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("046 - single quote in the front of a string", () => {
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
      `046.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("047 - single quote in the front of a string", () => {
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
      `047.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("048 - single quotes wrapping word, ending in the middle", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'Twon't be the night before Christmas.", opt).res,
      "’Twon’t be the night before Christmas.",
      `048.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("049 - single quotes wrapping a word, ending in between words", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'70s are my favorite numbers,' she said.", opt).res,
      `${rightSingleQuote}70s are my favorite numbers,${rightSingleQuote} she said.`,
      `049.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("050 - single quote on years", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "'70s fashion was weird.", opt).res,
      `${rightSingleQuote}70s fashion was weird.`,
      `050.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("051 - inches", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, '12" record, 5\'10" height', opt).res,
      "12″ record, 5′10″ height",
      `051.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("052 - word wrapped with double quotes in the end of a string", () => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'Model "T2000"', opt).res,
      `Model ${leftDoubleQuote}T2000${rightDoubleQuote}`,
      `052.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("053 - plural", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "iPad 3's battery life is not great.", opt).res,
      "iPad 3’s battery life is not great.",
      `053.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("054 - plural", () => {
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
      `054.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

// Example from https://practicaltypography.com/apostrophes.html
test("055 - Buttericks example - on", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "In the '60s, rock 'n' roll", opt).res,
      "In the ’60s, rock ’n’ roll",
      `055.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("056 - Buttericks example - off", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: false,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "In the '60s, rock 'n' roll", opt).res,
      "In the '60s, rock 'n' roll",
      `056.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("057 - Hawaii - sets okina #1", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Hawai'i", opt).res,
      "Hawai‘i",
      `057.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test("058 - Hawaii - sets okina #2", () => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "O'ahu", opt).res,
      "O‘ahu",
      `058.01 - ${JSON.stringify(opt, null, 4)}`,
    );
  });
});

test.run();
