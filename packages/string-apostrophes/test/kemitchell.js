// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import {
  doublePrime,
  leftDoubleQuote,
  leftSingleQuote,
  rightDoubleQuote,
  rightSingleQuote,
  singlePrime,
} from "codsen-utils";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { convertAll } from "../dist/string-apostrophes.esm.js";

// The following unit tests adapted from:
// https://github.com/kemitchell/straight-to-curly-quotes.json/
// License CC0-1.0

test(`01 - kemitchell/straight-to-curly-quotes - one word wrapped with double quotes`, () => {
  equal(
    convertAll('"Hello!"', {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}Hello!${rightDoubleQuote}`,
    "01.01",
  );
});

test(`02 - kemitchell/straight-to-curly-quotes - single quote surrounded by letters`, () => {
  equal(
    convertAll("ain't", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `ain${rightSingleQuote}t`,
    "02.01",
  );
});

test(`03 - kemitchell/straight-to-curly-quotes - single quote surrounded by letters 2`, () => {
  equal(
    convertAll("ma'am", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `ma${rightSingleQuote}am`,
    "03.01",
  );
});

test(`04 - kemitchell/straight-to-curly-quotes - leading single quote`, () => {
  equal(
    convertAll("'Twas the night", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Twas the night`,
    "04.01",
  );
});

test(`05 - kemitchell/straight-to-curly-quotes - mixed quotes within a single sentence`, () => {
  equal(
    convertAll('"Hello," said the spider. "\'Shelob\' is my name."', {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}Hello,${rightDoubleQuote} said the spider. ${leftDoubleQuote}${leftSingleQuote}Shelob${rightSingleQuote} is my name.${rightDoubleQuote}`,
    "05.01",
  );
});

test(`06 - kemitchell/straight-to-curly-quotes - single letters wrapped with single quotes`, () => {
  equal(
    convertAll("'A', 'B', and 'C' are letters.", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}A${rightSingleQuote}, ${leftSingleQuote}B${rightSingleQuote}, and ${leftSingleQuote}C${rightSingleQuote} are letters.`,
    "06.01",
  );
});

test(`07 - kemitchell/straight-to-curly-quotes - words wrapped with single quotes`, () => {
  equal(
    convertAll("'Oak,' 'elm,' and 'beech' are names of trees. So is 'pine.'", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}Oak,${rightSingleQuote} ${leftSingleQuote}elm,${rightSingleQuote} and ${leftSingleQuote}beech${rightSingleQuote} are names of trees. So is ${leftSingleQuote}pine.${rightSingleQuote}`,
    "07.01",
  );
});

test(`08 - kemitchell/straight-to-curly-quotes - double quotes within single quotes`, () => {
  equal(
    convertAll("'He said, \"I want to go.\"' Were you alive in the 70's?", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}He said, ${leftDoubleQuote}I want to go.${rightDoubleQuote}${rightSingleQuote} Were you alive in the 70${rightSingleQuote}s?`,
    "08.01",
  );
});

test(`09 - kemitchell/straight-to-curly-quotes - double quotes within single quotes`, () => {
  equal(
    convertAll("\"That's a 'magic' sock.\"", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}That${rightSingleQuote}s a ${leftSingleQuote}magic${rightSingleQuote} sock.${rightDoubleQuote}`,
    "09.01",
  );
});

test(`10 - kemitchell/straight-to-curly-quotes - double quotes within double quotes`, () => {
  equal(
    convertAll(
      'Welcome to Website Name! Company Name, Inc. ("Company Name" or "Company") recommends that you read the following terms and conditions carefully.',
      {
        convertApostrophes: 1,
        convertEntities: 0,
      },
    ).result,
    `Welcome to Website Name! Company Name, Inc. (${leftDoubleQuote}Company Name${rightDoubleQuote} or ${leftDoubleQuote}Company${rightDoubleQuote}) recommends that you read the following terms and conditions carefully.`,
    "10.01",
  );
});

test(`11 - kemitchell/straight-to-curly-quotes - single quotes within double quotes`, () => {
  equal(
    convertAll(
      "Welcome to Website Name! Company Name, Inc. ('Company Name' or 'Company') recommends that you read the following terms and conditions carefully.",
      {
        convertApostrophes: 1,
        convertEntities: 0,
      },
    ).result,
    `Welcome to Website Name! Company Name, Inc. (${leftSingleQuote}Company Name${rightSingleQuote} or ${leftSingleQuote}Company${rightSingleQuote}) recommends that you read the following terms and conditions carefully.`,
    "11.01",
  );
});

test(`12 - kemitchell/straight-to-curly-quotes - plural`, () => {
  equal(
    convertAll("'85 was a good year. (The entire '80s were.)", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}85 was a good year. (The entire ${rightSingleQuote}80s were.)`,
    "12.01",
  );
});

test(`13 - kemitchell/straight-to-curly-quotes - single quote in the end of a word`, () => {
  equal(
    convertAll("Workin' hard", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `Workin${rightSingleQuote} hard`,
    "13.01",
  );
});

test(`14 - kemitchell/straight-to-curly-quotes - single quote in the front of a word`, () => {
  equal(
    convertAll("'Twas the night before Christmas.", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Twas the night before Christmas.`,
    "14.01",
  );
});

test(`15 - kemitchell/straight-to-curly-quotes - single quote in the front of a word plus in the middle`, () => {
  equal(
    convertAll("'Twasn't the night before Christmas.", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Twasn${rightSingleQuote}t the night before Christmas.`,
    "15.01",
  );
});

test(`16 - kemitchell/straight-to-curly-quotes - single quote in the front of a word plus in the middle`, () => {
  equal(
    convertAll("'Tis the night before Christmas.", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Tis the night before Christmas.`,
    "16.01",
  );
});

test(`17 - kemitchell/straight-to-curly-quotes - single quote in the front of a word plus in the middle`, () => {
  equal(
    convertAll("'Tisn't the night before Christmas.", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Tisn${rightSingleQuote}t the night before Christmas.`,
    "17.01",
  );
});

test(`18 - kemitchell/straight-to-curly-quotes - single quote in the front of a string`, () => {
  equal(
    convertAll("'Twill be the night before Christmas.", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Twill be the night before Christmas.`,
    "18.01",
  );
});

test(`19 - kemitchell/straight-to-curly-quotes - single quote in the front of a string`, () => {
  equal(
    convertAll("'Twould be the night before Christmas.", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Twould be the night before Christmas.`,
    "19.01",
  );
});

test(`20 - kemitchell/straight-to-curly-quotes - single quote in the front of a string`, () => {
  equal(
    convertAll("'Twere the night before Christmas, I would be happy.", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Twere the night before Christmas, I would be happy.`,
    "20.01",
  );
});

test(`21 - kemitchell/straight-to-curly-quotes - single quote in the front of a string`, () => {
  equal(
    convertAll("'Tweren't the night before Christmas, I would be happy.", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Tweren${rightSingleQuote}t the night before Christmas, I would be happy.`,
    "21.01",
  );
});

test(`22 - kemitchell/straight-to-curly-quotes - single quotes wrapping word, ending in the middle`, () => {
  equal(
    convertAll("'Twon't be the night before Christmas.", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Twon${rightSingleQuote}t be the night before Christmas.`,
    "22.01",
  );
});

test(`23 - kemitchell/straight-to-curly-quotes - single quotes wrapping a word, ending in between words`, () => {
  equal(
    convertAll("'70s are my favorite numbers,' she said.", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}70s are my favorite numbers,${rightSingleQuote} she said.`,
    "23.01",
  );
});

test(`24 - kemitchell/straight-to-curly-quotes - single quote on years`, () => {
  equal(
    convertAll("'70s fashion was weird.", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}70s fashion was weird.`,
    "24.01",
  );
});

test(`25 - kemitchell/straight-to-curly-quotes - prime - inches`, () => {
  equal(
    convertAll('12" record, 5\'10" height', {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `12${doublePrime} record, 5${singlePrime}10${doublePrime} height`,
    "25.01",
  );
});

test(`26 - kemitchell/straight-to-curly-quotes - prime - left type quote used`, () => {
  equal(
    convertAll(`12" record, 5${leftSingleQuote}10${leftDoubleQuote} height`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `12${doublePrime} record, 5${singlePrime}10${doublePrime} height`,
    "26.01",
  );
});

test(`27 - kemitchell/straight-to-curly-quotes - prime - right type quote used`, () => {
  equal(
    convertAll(`12" record, 5${rightSingleQuote}10${rightDoubleQuote} height`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `12${doublePrime} record, 5${singlePrime}10${doublePrime} height`,
    "27.01",
  );
});

test(`28 - kemitchell/straight-to-curly-quotes - word wrapped with double quotes in the end of a string`, () => {
  equal(
    convertAll('Model "T2000"', {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `Model ${leftDoubleQuote}T2000${rightDoubleQuote}`,
    "28.01",
  );
});

test(`29 - kemitchell/straight-to-curly-quotes - plural`, () => {
  equal(
    convertAll("iPad 3's battery life is not great.", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `iPad 3${rightSingleQuote}s battery life is not great.`,
    "29.01",
  );
});

test(`30 - kemitchell/straight-to-curly-quotes - plural`, () => {
  equal(
    convertAll("Book 'em, Danno. Rock 'n' roll. 'Cause 'twas the season.", {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `Book ${rightSingleQuote}em, Danno. Rock ${rightSingleQuote}n${rightSingleQuote} roll. ${rightSingleQuote}Cause ${rightSingleQuote}twas the season.`,
    "30.01",
  );
});

test(`31 - kemitchell/straight-to-curly-quotes - left type used`, () => {
  equal(
    convertAll(
      `Book ${leftSingleQuote}em, Danno. Rock ${leftSingleQuote}n${leftSingleQuote} roll. ${leftSingleQuote}Cause ${leftSingleQuote}twas the season.`,
      {
        convertApostrophes: 1,
        convertEntities: 0,
      },
    ).result,
    `Book ${rightSingleQuote}em, Danno. Rock ${rightSingleQuote}n${rightSingleQuote} roll. ${rightSingleQuote}Cause ${rightSingleQuote}twas the season.`,
    "31.01",
  );
});

test(`32 - kemitchell/straight-to-curly-quotes - right type used`, () => {
  equal(
    convertAll(
      `Book ${rightSingleQuote}em, Danno. Rock ${rightSingleQuote}n${rightSingleQuote} roll. ${rightSingleQuote}Cause ${rightSingleQuote}twas the season.`,
      {
        convertApostrophes: 1,
        convertEntities: 0,
      },
    ).result,
    `Book ${rightSingleQuote}em, Danno. Rock ${rightSingleQuote}n${rightSingleQuote} roll. ${rightSingleQuote}Cause ${rightSingleQuote}twas the season.`,
    "32.01",
  );
});

test(`33 - kemitchell/straight-to-curly-quotes - left type used`, () => {
  equal(
    convertAll(
      `Book ${leftSingleQuote}em, Danno. Rock ${leftSingleQuote}n${leftSingleQuote} roll. ${leftSingleQuote}Cause ${leftSingleQuote}twas the season.`,
      {
        convertApostrophes: 1,
        convertEntities: 1,
      },
    ).result,
    "Book &rsquo;em, Danno. Rock &rsquo;n&rsquo; roll. &rsquo;Cause &rsquo;twas the season.",
    "33.01",
  );
});

test(`34 - kemitchell/straight-to-curly-quotes - right type used`, () => {
  equal(
    convertAll(
      `Book ${rightSingleQuote}em, Danno. Rock ${rightSingleQuote}n${rightSingleQuote} roll. ${rightSingleQuote}Cause ${rightSingleQuote}twas the season.`,
      {
        convertApostrophes: 1,
        convertEntities: 1,
      },
    ).result,
    "Book &rsquo;em, Danno. Rock &rsquo;n&rsquo; roll. &rsquo;Cause &rsquo;twas the season.",
    "34.01",
  );
});

test(`35 - kemitchell/straight-to-curly-quotes - mixed quotes within a single sentence`, () => {
  equal(
    convertAll(
      '"Hello," said the spider. "\'Shelob\'" abruptly she announced.',
      {
        convertApostrophes: 1,
        convertEntities: 0,
      },
    ).result,
    `${leftDoubleQuote}Hello,${rightDoubleQuote} said the spider. ${leftDoubleQuote}${leftSingleQuote}Shelob${rightSingleQuote}${rightDoubleQuote} abruptly she announced.`,
    "35.01",
  );
});

test(`36 - kemitchell/straight-to-curly-quotes - all off, nothing fancy to start with`, () => {
  let input = '"Hello," said the spider. "\'Shelob\'" abruptly she announced.';
  equal(
    convertAll(input, {
      convertApostrophes: 0,
      convertEntities: 0,
    }).result,
    input,
    "36.01",
  );
});

test(`37 - astral letters around an apostrophe`, () => {
  equal(convertAll("𐐨'𐐨").result, "𐐨’𐐨", "37.01");
});

test.run();
