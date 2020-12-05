import tap from "tap";
// import detergent from "../dist/detergent.esm";
// const det1 = detergent.det;
import { det, mixer } from "../t-util/util";

// -----------------------------------------------------------------------------

import {
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  // rawNbsp,
  // rawhairspace,
  // rawEllipsis,
  rightSingleQuote,
  rightDoubleQuote,
  leftDoubleQuote,
  leftSingleQuote,
} from "../src/util";

// -----------------------------------------------------------------------------

tap.test(`01 - converts single apostrophes - with entities`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "test's", opt).res,
      "test&rsquo;s",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`02 - converts single apostrophes - no entities`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "test's", opt).res,
      "test\u2019s",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`03 - doesn't convert single apostrophes`, (t) => {
  mixer({
    convertApostrophes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "test's", opt).res,
      "test's",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`04 - converts quotation marks into fancy ones: +entities`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, 'this is "citation"', opt).res,
      "this is &ldquo;citation&rdquo;",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`05 - converts quotation marks into fancy ones: -entities`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, 'this is "citation"', opt).res,
      "this is \u201Ccitation\u201D",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`06 - doesn't convert quotation marks: -apostrophes-entities`, (t) => {
  mixer({
    convertApostrophes: false,
    convertEntities: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, 'this is "citation"', opt).res,
      'this is "citation"',
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`07 - exclamation mark + double quote`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, '"What!" he said', opt).res,
      `${leftDoubleQuote}What!${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`08 - full stop + double quote`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, '"What." he said', opt).res,
      `${leftDoubleQuote}What.${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`09 - comma + double quote`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, '"What," he said', opt).res,
      `${leftDoubleQuote}What,${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`10 - semicolon + double quote`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, '"What;" he said', opt).res,
      `${leftDoubleQuote}What;${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`11 - question mark + double quote`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, '"What?" he said', opt).res,
      `${leftDoubleQuote}What?${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`12 - exclamation mark + double quote + space`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'What!' he said", opt).res,
      `${leftSingleQuote}What!${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`13 - full stop + double quote + space`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'What.' he said", opt).res,
      `${leftSingleQuote}What.${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`14 - comma + double quote + space`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'What,' he said", opt).res,
      `${leftSingleQuote}What,${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`15 - semicolon + double quote + space`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'What;' he said", opt).res,
      `${leftSingleQuote}What;${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`16 - question mark + double quote + space`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'What?' he said", opt).res,
      `${leftSingleQuote}What?${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`17 - exclamation mark + single quote + double quote`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "\"'What!'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What!${rightSingleQuote}${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`18 - full stop + single quote + double quote`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "\"'What.'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What.${rightSingleQuote}${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`19 - comma + single quote + double quote`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "\"'What,'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What,${rightSingleQuote}${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`20 - semicolon + single quote + double quote`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "\"'What;'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What;${rightSingleQuote}${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`21 - question mark + single quote + double quote`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "\"'What;'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What;${rightSingleQuote}${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`22 - exclamation mark + double quote + single quote`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'\"What!\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What!${rightDoubleQuote}${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`23 - full stop + double quote + single quote`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'\"What.\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What.${rightDoubleQuote}${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`24 - comma + double quote + single quote`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'\"What,\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What,${rightDoubleQuote}${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`25 - semicolon + double quote + single quote`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'\"What;\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What;${rightDoubleQuote}${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`26 - question mark + double quote + single quote`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'\"What?\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What?${rightDoubleQuote}${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

// Following unit tests adapted from:
// https://github.com/kemitchell/straight-to-curly-quotes.JSON.
// License CC0-1.0

tap.test(`27 - one word wrapped with double quotes`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, '"Hello!"', opt).res,
      "“Hello!”",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`28 - single quote surrounded by letters`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(det(t, n, "ain't", opt).res, "ain’t", JSON.stringify(opt, null, 4));
  });
  t.end();
});

tap.test(`29 - single quote surrounded by letters 2`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(det(t, n, "ma'am", opt).res, "ma’am", JSON.stringify(opt, null, 4));
  });
  t.end();
});

tap.test(`30 - leading single quote`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'Twas the night", opt).res,
      `${rightSingleQuote}Twas the night`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`31 - mixed quotes within a single sentence`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, '"Hello," said the spider. "\'Shelob\' is my name."', opt).res,
      "“Hello,” said the spider. “‘Shelob’ is my name.”",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`32 - single letters wrapped with single quotes`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'A', 'B', and 'C' are letters.", opt).res,
      "‘A’, ‘B’, and ‘C’ are letters.",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`33 - words wrapped with single quotes`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        "'Oak,' 'elm,' and 'beech' are names of trees. So is 'pine.'",
        opt
      ).res,
      "‘Oak,’ ‘elm,’ and ‘beech’ are names of trees. So is ‘pine.’",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`34 - double quotes within single quotes`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'He said, \"I want to go.\"' Were you alive in the 70's?", opt)
        .res,
      "‘He said, “I want to go.”’ Were you alive in the 70’s?",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`35 - double quotes within single quotes`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "\"That's a 'magic' sock.\"", opt).res,
      "“That’s a ‘magic’ sock.”",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`36 - double quotes within double quotes`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        'Welcome to Website Name! Company Name, Inc. ("Company Name" or "Company") recommends that you read the following terms and conditions carefully.',
        opt
      ).res,
      "Welcome to Website Name! Company Name, Inc. (“Company Name” or “Company”) recommends that you read the following terms and conditions carefully.",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`37 - single quotes within double quotes`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(
        t,
        n,
        "Welcome to Website Name! Company Name, Inc. ('Company Name' or 'Company') recommends that you read the following terms and conditions carefully.",
        opt
      ).res,
      "Welcome to Website Name! Company Name, Inc. (‘Company Name’ or ‘Company’) recommends that you read the following terms and conditions carefully.",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`38 - plural`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'85 was a good year. (The entire '80s were.)", opt).res,
      "’85 was a good year. (The entire ’80s were.)",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`39 - single quote in the end of a word`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "Workin' hard", opt).res,
      "Workin’ hard",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`40 - single quote in the front of a word`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'Twas the night before Christmas.", opt).res,
      "’Twas the night before Christmas.",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`41 - single quote in the front of a word plus in the middle`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'Twasn't the night before Christmas.", opt).res,
      "’Twasn’t the night before Christmas.",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`42 - single quote in the front of a word plus in the middle`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'Tis the night before Christmas.", opt).res,
      "’Tis the night before Christmas.",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`43 - single quote in the front of a word plus in the middle`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'Tisn't the night before Christmas.", opt).res,
      "’Tisn’t the night before Christmas.",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`44 - single quote in the front of a string`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'Twill be the night before Christmas.", opt).res,
      `${rightSingleQuote}Twill be the night before Christmas.`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`45 - single quote in the front of a string`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'Twould be the night before Christmas.", opt).res,
      `${rightSingleQuote}Twould be the night before Christmas.`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`46 - single quote in the front of a string`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'Twere the night before Christmas, I would be happy.", opt)
        .res,
      "’Twere the night before Christmas, I would be happy.",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`47 - single quote in the front of a string`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'Tweren't the night before Christmas, I would be happy.", opt)
        .res,
      "’Tweren’t the night before Christmas, I would be happy.",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`48 - single quotes wrapping word, ending in the middle`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'Twon't be the night before Christmas.", opt).res,
      "’Twon’t be the night before Christmas.",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`49 - single quotes wrapping a word, ending in between words`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'70s are my favorite numbers,' she said.", opt).res,
      `${rightSingleQuote}70s are my favorite numbers,${rightSingleQuote} she said.`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`50 - single quote on years`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "'70s fashion was weird.", opt).res,
      `${rightSingleQuote}70s fashion was weird.`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`51 - inches`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, '12" record, 5\'10" height', opt).res,
      "12″ record, 5′10″ height",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`52 - word wrapped with double quotes in the end of a string`, (t) => {
  mixer({
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, 'Model "T2000"', opt).res,
      `Model ${leftDoubleQuote}T2000${rightDoubleQuote}`,
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`53 - plural`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "iPad 3's battery life is not great.", opt).res,
      "iPad 3’s battery life is not great.",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`54 - plural`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "Book 'em, Danno. Rock 'n' roll. 'Cause 'twas the season.", opt)
        .res,
      "Book ’em, Danno. Rock ’n’ roll. ’Cause ’twas the season.",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

// Example from https://practicaltypography.com/apostrophes.html
tap.test(`55 - Buttericks example - on`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "In the '60s, rock 'n' roll", opt).res,
      "In the ’60s, rock ’n’ roll",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`56 - Buttericks example - off`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: false,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "In the '60s, rock 'n' roll", opt).res,
      "In the '60s, rock 'n' roll",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`57 - Hawaii - sets okina #1`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, "Hawai'i", opt).res,
      "Hawai‘i",
      JSON.stringify(opt, null, 4)
    );
  });
  t.end();
});

tap.test(`58 - Hawaii - sets okina #2`, (t) => {
  mixer({
    removeWidows: false,
    convertApostrophes: true,
    convertEntities: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    t.equal(det(t, n, "O'ahu", opt).res, "O‘ahu", JSON.stringify(opt, null, 4));
  });
  t.end();
});
