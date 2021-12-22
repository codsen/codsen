import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { convertAll } from "../dist/string-apostrophes.esm.js";

const leftSingleQuote = "\u2018";
const rightSingleQuote = "\u2019";
const leftDoubleQuote = "\u201C";
const rightDoubleQuote = "\u201D";
const singlePrime = "\u2032";
const doublePrime = "\u2033";

// Following unit tests adapted from:
// https://github.com/kemitchell/straight-to-curly-quotes.json/
// License CC0-1.0

test(`01 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - one word wrapped with double quotes`, () => {
  equal(
    convertAll('"Hello!"', {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}Hello!${rightDoubleQuote}`,
    "01"
  );
});

test(`02 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote surrounded by letters`, () => {
  equal(
    convertAll(`ain't`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `ain${rightSingleQuote}t`,
    "02"
  );
});

test(`03 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote surrounded by letters 2`, () => {
  equal(
    convertAll(`ma'am`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `ma${rightSingleQuote}am`,
    "03"
  );
});

test(`04 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - leading single quote`, () => {
  equal(
    convertAll(`'Twas the night`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Twas the night`,
    "04"
  );
});

test(`05 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - mixed quotes within a single sentence`, () => {
  equal(
    convertAll(`"Hello," said the spider. "'Shelob' is my name."`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}Hello,${rightDoubleQuote} said the spider. ${leftDoubleQuote}${leftSingleQuote}Shelob${rightSingleQuote} is my name.${rightDoubleQuote}`,
    "05"
  );
});

test(`06 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single letters wrapped with single quotes`, () => {
  equal(
    convertAll(`'A', 'B', and 'C' are letters.`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}A${rightSingleQuote}, ${leftSingleQuote}B${rightSingleQuote}, and ${leftSingleQuote}C${rightSingleQuote} are letters.`,
    "06"
  );
});

test(`07 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - words wrapped with single quotes`, () => {
  equal(
    convertAll(`'Oak,' 'elm,' and 'beech' are names of trees. So is 'pine.'`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}Oak,${rightSingleQuote} ${leftSingleQuote}elm,${rightSingleQuote} and ${leftSingleQuote}beech${rightSingleQuote} are names of trees. So is ${leftSingleQuote}pine.${rightSingleQuote}`,
    "07"
  );
});

test(`08 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - double quotes within single quotes`, () => {
  equal(
    convertAll(`'He said, "I want to go."' Were you alive in the 70's?`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftSingleQuote}He said, ${leftDoubleQuote}I want to go.${rightDoubleQuote}${rightSingleQuote} Were you alive in the 70${rightSingleQuote}s?`,
    "08"
  );
});

test(`09 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - double quotes within single quotes`, () => {
  equal(
    convertAll(`"That's a 'magic' sock."`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}That${rightSingleQuote}s a ${leftSingleQuote}magic${rightSingleQuote} sock.${rightDoubleQuote}`,
    "09"
  );
});

test(`10 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - double quotes within double quotes`, () => {
  equal(
    convertAll(
      `Welcome to Website Name! Company Name, Inc. ("Company Name" or "Company") recommends that you read the following terms and conditions carefully.`,
      {
        convertApostrophes: 1,
        convertEntities: 0,
      }
    ).result,
    `Welcome to Website Name! Company Name, Inc. (${leftDoubleQuote}Company Name${rightDoubleQuote} or ${leftDoubleQuote}Company${rightDoubleQuote}) recommends that you read the following terms and conditions carefully.`,
    "10"
  );
});

test(`11 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quotes within double quotes`, () => {
  equal(
    convertAll(
      `Welcome to Website Name! Company Name, Inc. ('Company Name' or 'Company') recommends that you read the following terms and conditions carefully.`,
      {
        convertApostrophes: 1,
        convertEntities: 0,
      }
    ).result,
    `Welcome to Website Name! Company Name, Inc. (${leftSingleQuote}Company Name${rightSingleQuote} or ${leftSingleQuote}Company${rightSingleQuote}) recommends that you read the following terms and conditions carefully.`,
    "11"
  );
});

test(`12 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - plural`, () => {
  equal(
    convertAll(`'85 was a good year. (The entire '80s were.)`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}85 was a good year. (The entire ${rightSingleQuote}80s were.)`,
    "12"
  );
});

test(`13 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the end of a word`, () => {
  equal(
    convertAll(`Workin' hard`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `Workin${rightSingleQuote} hard`,
    "13"
  );
});

test(`14 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a word`, () => {
  equal(
    convertAll(`'Twas the night before Christmas.`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Twas the night before Christmas.`,
    "14"
  );
});

test(`15 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a word plus in the middle`, () => {
  equal(
    convertAll(`'Twasn't the night before Christmas.`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Twasn${rightSingleQuote}t the night before Christmas.`,
    "15"
  );
});

test(`16 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a word plus in the middle`, () => {
  equal(
    convertAll(`'Tis the night before Christmas.`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Tis the night before Christmas.`,
    "16"
  );
});

test(`17 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a word plus in the middle`, () => {
  equal(
    convertAll(`'Tisn't the night before Christmas.`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Tisn${rightSingleQuote}t the night before Christmas.`,
    "17"
  );
});

test(`18 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a string`, () => {
  equal(
    convertAll(`'Twill be the night before Christmas.`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Twill be the night before Christmas.`,
    "18"
  );
});

test(`19 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a string`, () => {
  equal(
    convertAll(`'Twould be the night before Christmas.`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Twould be the night before Christmas.`,
    "19"
  );
});

test(`20 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a string`, () => {
  equal(
    convertAll(`'Twere the night before Christmas, I would be happy.`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Twere the night before Christmas, I would be happy.`,
    "20"
  );
});

test(`21 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a string`, () => {
  equal(
    convertAll(`'Tweren't the night before Christmas, I would be happy.`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Tweren${rightSingleQuote}t the night before Christmas, I would be happy.`,
    "21"
  );
});

test(`22 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quotes wrapping word, ending in the middle`, () => {
  equal(
    convertAll(`'Twon't be the night before Christmas.`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}Twon${rightSingleQuote}t be the night before Christmas.`,
    "22"
  );
});

test(`23 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quotes wrapping a word, ending in between words`, () => {
  equal(
    convertAll(`'70s are my favorite numbers,' she said.`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}70s are my favorite numbers,${rightSingleQuote} she said.`,
    "23"
  );
});

test(`24 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote on years`, () => {
  equal(
    convertAll(`'70s fashion was weird.`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${rightSingleQuote}70s fashion was weird.`,
    "24"
  );
});

test(`25 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - prime - inches`, () => {
  equal(
    convertAll('12" record, 5\'10" height', {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `12${doublePrime} record, 5${singlePrime}10${doublePrime} height`,
    "25"
  );
});

test(`26 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - prime - left type quote used`, () => {
  equal(
    convertAll(`12" record, 5${leftSingleQuote}10${leftDoubleQuote} height`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `12${doublePrime} record, 5${singlePrime}10${doublePrime} height`,
    "26"
  );
});

test(`27 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - prime - right type quote used`, () => {
  equal(
    convertAll(`12" record, 5${rightSingleQuote}10${rightDoubleQuote} height`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `12${doublePrime} record, 5${singlePrime}10${doublePrime} height`,
    "27"
  );
});

test(`28 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - word wrapped with double quotes in the end of a string`, () => {
  equal(
    convertAll('Model "T2000"', {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `Model ${leftDoubleQuote}T2000${rightDoubleQuote}`,
    "28"
  );
});

test(`29 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - plural`, () => {
  equal(
    convertAll(`iPad 3's battery life is not great.`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `iPad 3${rightSingleQuote}s battery life is not great.`,
    "29"
  );
});

test(`30 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - plural`, () => {
  equal(
    convertAll(`Book 'em, Danno. Rock 'n' roll. 'Cause 'twas the season.`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `Book ${rightSingleQuote}em, Danno. Rock ${rightSingleQuote}n${rightSingleQuote} roll. ${rightSingleQuote}Cause ${rightSingleQuote}twas the season.`,
    "30"
  );
});

test(`31 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - left type used`, () => {
  equal(
    convertAll(
      `Book ${leftSingleQuote}em, Danno. Rock ${leftSingleQuote}n${leftSingleQuote} roll. ${leftSingleQuote}Cause ${leftSingleQuote}twas the season.`,
      {
        convertApostrophes: 1,
        convertEntities: 0,
      }
    ).result,
    `Book ${rightSingleQuote}em, Danno. Rock ${rightSingleQuote}n${rightSingleQuote} roll. ${rightSingleQuote}Cause ${rightSingleQuote}twas the season.`,
    "31"
  );
});

test(`32 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - right type used`, () => {
  equal(
    convertAll(
      `Book ${rightSingleQuote}em, Danno. Rock ${rightSingleQuote}n${rightSingleQuote} roll. ${rightSingleQuote}Cause ${rightSingleQuote}twas the season.`,
      {
        convertApostrophes: 1,
        convertEntities: 0,
      }
    ).result,
    `Book ${rightSingleQuote}em, Danno. Rock ${rightSingleQuote}n${rightSingleQuote} roll. ${rightSingleQuote}Cause ${rightSingleQuote}twas the season.`,
    "32"
  );
});

test(`33 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - left type used`, () => {
  equal(
    convertAll(
      `Book ${leftSingleQuote}em, Danno. Rock ${leftSingleQuote}n${leftSingleQuote} roll. ${leftSingleQuote}Cause ${leftSingleQuote}twas the season.`,
      {
        convertApostrophes: 1,
        convertEntities: 1,
      }
    ).result,
    `Book &rsquo;em, Danno. Rock &rsquo;n&rsquo; roll. &rsquo;Cause &rsquo;twas the season.`,
    "33"
  );
});

test(`34 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - right type used`, () => {
  equal(
    convertAll(
      `Book ${rightSingleQuote}em, Danno. Rock ${rightSingleQuote}n${rightSingleQuote} roll. ${rightSingleQuote}Cause ${rightSingleQuote}twas the season.`,
      {
        convertApostrophes: 1,
        convertEntities: 1,
      }
    ).result,
    `Book &rsquo;em, Danno. Rock &rsquo;n&rsquo; roll. &rsquo;Cause &rsquo;twas the season.`,
    "34"
  );
});

test(`35 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - mixed quotes within a single sentence`, () => {
  equal(
    convertAll(`"Hello," said the spider. "'Shelob'" abruptly she announced.`, {
      convertApostrophes: 1,
      convertEntities: 0,
    }).result,
    `${leftDoubleQuote}Hello,${rightDoubleQuote} said the spider. ${leftDoubleQuote}${leftSingleQuote}Shelob${rightSingleQuote}${rightDoubleQuote} abruptly she announced.`,
    "35"
  );
});

test(`36 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - all off, nothing fancy to start with`, () => {
  let input = `"Hello," said the spider. "'Shelob'" abruptly she announced.`;
  equal(
    convertAll(input, {
      convertApostrophes: 0,
      convertEntities: 0,
    }).result,
    input,
    "36"
  );
});

test.run();
