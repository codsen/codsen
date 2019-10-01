// avanotonly

import test from "ava";
import {
  det,
  mixer
  // allCombinations
} from "../t-util/util";
import { det as det1 } from "../dist/detergent.esm";

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
  leftSingleQuote
} from "../dist/util.esm";

// -----------------------------------------------------------------------------

test(`01 - converts single apostrophes - with entities`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(t, "test's", opt).res,
      "test&rsquo;s",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02 - converts single apostrophes - no entities`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(t, "test's", opt).res,
      "test\u2019s",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`03 - doesn't convert single apostrophes`, t => {
  mixer({
    convertApostrophes: 0
  }).forEach(opt => {
    t.is(det(t, "test's", opt).res, "test's", JSON.stringify(opt, null, 4));
  });
});

test(`04 - converts quotation marks into fancy ones: +entities`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(t, 'this is "citation"', opt).res,
      "this is &ldquo;citation&rdquo;",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`05 - converts quotation marks into fancy ones: -entities`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(t, 'this is "citation"', opt).res,
      "this is \u201Ccitation\u201D",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`06 - doesn't convert quotation marks: -apostrophes-entities`, t => {
  mixer({
    convertApostrophes: 0,
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(t, 'this is "citation"', opt).res,
      'this is "citation"',
      JSON.stringify(opt, null, 4)
    );
  });

  t.deepEqual(
    det1('this is "citation"', {
      convertApostrophes: 0,
      convertEntities: 0
    }),
    {
      res: 'this is "citation"',
      applicableOpts: {
        fixBrokenEntities: false,
        removeWidows: false,
        convertEntities: false,
        convertDashes: false,
        convertApostrophes: true,
        replaceLineBreaks: false,
        removeLineBreaks: false,
        useXHTML: false,
        dontEncodeNonLatin: false,
        addMissingSpaces: false,
        convertDotsToEllipsis: false,
        stripHtml: false
      }
    }
  );
});

test(`07 - exclamation mark + double quote`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, '"What!" he said', opt).res,
      `${leftDoubleQuote}What!${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`08 - full stop + double quote`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, '"What." he said', opt).res,
      `${leftDoubleQuote}What.${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`09 - comma + double quote`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, '"What," he said', opt).res,
      `${leftDoubleQuote}What,${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`10 - semicolon + double quote`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, '"What;" he said', opt).res,
      `${leftDoubleQuote}What;${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`11 - question mark + double quote`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, '"What?" he said', opt).res,
      `${leftDoubleQuote}What?${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`12 - exclamation mark + double quote + space`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'What!' he said", opt).res,
      `${leftSingleQuote}What!${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`13 - full stop + double quote + space`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'What.' he said", opt).res,
      `${leftSingleQuote}What.${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`14 - comma + double quote + space`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'What,' he said", opt).res,
      `${leftSingleQuote}What,${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`15 - semicolon + double quote + space`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'What;' he said", opt).res,
      `${leftSingleQuote}What;${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`16 - question mark + double quote + space`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'What?' he said", opt).res,
      `${leftSingleQuote}What?${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`17 - exclamation mark + single quote + double quote`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "\"'What!'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What!${rightSingleQuote}${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`18 - full stop + single quote + double quote`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "\"'What.'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What.${rightSingleQuote}${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`19 - comma + single quote + double quote`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "\"'What,'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What,${rightSingleQuote}${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`20 - semicolon + single quote + double quote`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "\"'What;'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What;${rightSingleQuote}${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`21 - question mark + single quote + double quote`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "\"'What;'\" he said", opt).res,
      `${leftDoubleQuote}${leftSingleQuote}What;${rightSingleQuote}${rightDoubleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`22 - exclamation mark + double quote + single quote`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'\"What!\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What!${rightDoubleQuote}${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`23 - full stop + double quote + single quote`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'\"What.\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What.${rightDoubleQuote}${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`24 - comma + double quote + single quote`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'\"What,\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What,${rightDoubleQuote}${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`25 - semicolon + double quote + single quote`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'\"What;\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What;${rightDoubleQuote}${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`26 - question mark + double quote + single quote`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'\"What?\"' he said", opt).res,
      `${leftSingleQuote}${leftDoubleQuote}What?${rightDoubleQuote}${rightSingleQuote} he said`,
      JSON.stringify(opt, null, 4)
    );
  });
});

// Following unit tests adapted from:
// https://github.com/kemitchell/straight-to-curly-quotes.JSON.
// License CC0-1.0

test(`27 - one word wrapped with double quotes`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(det(t, '"Hello!"', opt).res, "“Hello!”", JSON.stringify(opt, null, 4));
  });
});

test(`28 - single quote surrounded by letters`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(det(t, "ain't", opt).res, "ain’t", JSON.stringify(opt, null, 4));
  });
});

test(`29 - single quote surrounded by letters 2`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(det(t, "ma'am", opt).res, "ma’am", JSON.stringify(opt, null, 4));
  });
});

test(`30 - leading single quote`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'Twas the night", opt).res,
      `${rightSingleQuote}Twas the night`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`31 - mixed quotes within a single sentence`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, '"Hello," said the spider. "\'Shelob\' is my name."', opt).res,
      "“Hello,” said the spider. “‘Shelob’ is my name.”",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`32 - single letters wrapped with single quotes`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'A', 'B', and 'C' are letters.", opt).res,
      "‘A’, ‘B’, and ‘C’ are letters.",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`33 - words wrapped with single quotes`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'Oak,' 'elm,' and 'beech' are names of trees. So is 'pine.'", opt)
        .res,
      "‘Oak,’ ‘elm,’ and ‘beech’ are names of trees. So is ‘pine.’",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`34 - double quotes within single quotes`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'He said, \"I want to go.\"' Were you alive in the 70's?", opt)
        .res,
      "‘He said, “I want to go.”’ Were you alive in the 70’s?",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`35 - double quotes within single quotes`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "\"That's a 'magic' sock.\"", opt).res,
      "“That’s a ‘magic’ sock.”",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`36 - double quotes within double quotes`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(
        t,
        'Welcome to Website Name! Company Name, Inc. ("Company Name" or "Company") recommends that you read the following terms and conditions carefully.',
        opt
      ).res,
      "Welcome to Website Name! Company Name, Inc. (“Company Name” or “Company”) recommends that you read the following terms and conditions carefully.",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`37 - single quotes within double quotes`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(
        t,
        "Welcome to Website Name! Company Name, Inc. ('Company Name' or 'Company') recommends that you read the following terms and conditions carefully.",
        opt
      ).res,
      "Welcome to Website Name! Company Name, Inc. (‘Company Name’ or ‘Company’) recommends that you read the following terms and conditions carefully.",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`38 - plural`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'85 was a good year. (The entire '80s were.)", opt).res,
      "’85 was a good year. (The entire ’80s were.)",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`39 - single quote in the end of a word`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "Workin' hard", opt).res,
      "Workin’ hard",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`40 - single quote in the front of a word`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'Twas the night before Christmas.", opt).res,
      "’Twas the night before Christmas.",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`41 - single quote in the front of a word plus in the middle`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'Twasn't the night before Christmas.", opt).res,
      "’Twasn’t the night before Christmas.",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`42 - single quote in the front of a word plus in the middle`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'Tis the night before Christmas.", opt).res,
      "’Tis the night before Christmas.",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`43 - single quote in the front of a word plus in the middle`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'Tisn't the night before Christmas.", opt).res,
      "’Tisn’t the night before Christmas.",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`44 - single quote in the front of a string`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'Twill be the night before Christmas.", opt).res,
      `${rightSingleQuote}Twill be the night before Christmas.`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`45 - single quote in the front of a string`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'Twould be the night before Christmas.", opt).res,
      `${rightSingleQuote}Twould be the night before Christmas.`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`46 - single quote in the front of a string`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'Twere the night before Christmas, I would be happy.", opt).res,
      "’Twere the night before Christmas, I would be happy.",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`47 - single quote in the front of a string`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'Tweren't the night before Christmas, I would be happy.", opt)
        .res,
      "’Tweren’t the night before Christmas, I would be happy.",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`48 - single quotes wrapping word, ending in the middle`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'Twon't be the night before Christmas.", opt).res,
      "’Twon’t be the night before Christmas.",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`49 - single quotes wrapping a word, ending in between words`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'70s are my favorite numbers,' she said.", opt).res,
      `${rightSingleQuote}70s are my favorite numbers,${rightSingleQuote} she said.`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`50 - single quote on years`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "'70s fashion was weird.", opt).res,
      `${rightSingleQuote}70s fashion was weird.`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`51 - inches`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, '12" record, 5\'10" height', opt).res,
      "12″ record, 5′10″ height",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`52 - word wrapped with double quotes in the end of a string`, t => {
  mixer({
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, 'Model "T2000"', opt).res,
      `Model ${leftDoubleQuote}T2000${rightDoubleQuote}`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`53 - plural`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "iPad 3's battery life is not great.", opt).res,
      "iPad 3’s battery life is not great.",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`54 - plural`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "Book 'em, Danno. Rock 'n' roll. 'Cause 'twas the season.", opt)
        .res,
      "Book ’em, Danno. Rock ’n’ roll. ’Cause ’twas the season.",
      JSON.stringify(opt, null, 4)
    );
  });
});

// Example from https://practicaltypography.com/apostrophes.html
test(`55 - Buttericks example - on`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "In the '60s, rock 'n' roll", opt).res,
      "In the ’60s, rock ’n’ roll",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`56 - Buttericks example - off`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 0,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, "In the '60s, rock 'n' roll", opt).res,
      "In the '60s, rock 'n' roll",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`57 - Hawaii - sets okina #1`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(det(t, "Hawai'i", opt).res, "Hawai‘i", JSON.stringify(opt, null, 4));
  });
});

test(`58 - Hawaii - sets okina #2`, t => {
  mixer({
    removeWidows: 0,
    convertApostrophes: 1,
    convertEntities: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(det(t, "O'ahu", opt).res, "O‘ahu", JSON.stringify(opt, null, 4));
  });
});
