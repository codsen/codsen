import tap from "tap";
import { convertAll } from "../dist/string-apostrophes.esm";

const leftSingleQuote = "\u2018";
const rightSingleQuote = "\u2019";
const leftDoubleQuote = "\u201C";
const rightDoubleQuote = "\u201D";
const singlePrime = "\u2032";
const doublePrime = "\u2033";

// Following unit tests adapted from:
// https://github.com/kemitchell/straight-to-curly-quotes.json/
// License CC0-1.0

tap.test(
  `01 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - one word wrapped with double quotes`,
  (t) => {
    t.same(
      convertAll('"Hello!"', {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}Hello!${rightDoubleQuote}`,
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote surrounded by letters`,
  (t) => {
    t.same(
      convertAll(`ain't`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `ain${rightSingleQuote}t`,
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote surrounded by letters 2`,
  (t) => {
    t.same(
      convertAll(`ma'am`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `ma${rightSingleQuote}am`,
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - leading single quote`,
  (t) => {
    t.same(
      convertAll(`'Twas the night`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Twas the night`,
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - mixed quotes within a single sentence`,
  (t) => {
    t.same(
      convertAll(`"Hello," said the spider. "'Shelob' is my name."`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}Hello,${rightDoubleQuote} said the spider. ${leftDoubleQuote}${leftSingleQuote}Shelob${rightSingleQuote} is my name.${rightDoubleQuote}`,
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single letters wrapped with single quotes`,
  (t) => {
    t.same(
      convertAll(`'A', 'B', and 'C' are letters.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}A${rightSingleQuote}, ${leftSingleQuote}B${rightSingleQuote}, and ${leftSingleQuote}C${rightSingleQuote} are letters.`,
      "06"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - words wrapped with single quotes`,
  (t) => {
    t.same(
      convertAll(
        `'Oak,' 'elm,' and 'beech' are names of trees. So is 'pine.'`,
        {
          convertApostrophes: 1,
          convertEntities: 0,
        }
      ).result,
      `${leftSingleQuote}Oak,${rightSingleQuote} ${leftSingleQuote}elm,${rightSingleQuote} and ${leftSingleQuote}beech${rightSingleQuote} are names of trees. So is ${leftSingleQuote}pine.${rightSingleQuote}`,
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - double quotes within single quotes`,
  (t) => {
    t.same(
      convertAll(`'He said, "I want to go."' Were you alive in the 70's?`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftSingleQuote}He said, ${leftDoubleQuote}I want to go.${rightDoubleQuote}${rightSingleQuote} Were you alive in the 70${rightSingleQuote}s?`,
      "08"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - double quotes within single quotes`,
  (t) => {
    t.same(
      convertAll(`"That's a 'magic' sock."`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${leftDoubleQuote}That${rightSingleQuote}s a ${leftSingleQuote}magic${rightSingleQuote} sock.${rightDoubleQuote}`,
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - double quotes within double quotes`,
  (t) => {
    t.same(
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
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quotes within double quotes`,
  (t) => {
    t.same(
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
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - plural`,
  (t) => {
    t.same(
      convertAll(`'85 was a good year. (The entire '80s were.)`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}85 was a good year. (The entire ${rightSingleQuote}80s were.)`,
      "12"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the end of a word`,
  (t) => {
    t.same(
      convertAll(`Workin' hard`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `Workin${rightSingleQuote} hard`,
      "13"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a word`,
  (t) => {
    t.same(
      convertAll(`'Twas the night before Christmas.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Twas the night before Christmas.`,
      "14"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a word plus in the middle`,
  (t) => {
    t.same(
      convertAll(`'Twasn't the night before Christmas.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Twasn${rightSingleQuote}t the night before Christmas.`,
      "15"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a word plus in the middle`,
  (t) => {
    t.same(
      convertAll(`'Tis the night before Christmas.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Tis the night before Christmas.`,
      "16"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a word plus in the middle`,
  (t) => {
    t.same(
      convertAll(`'Tisn't the night before Christmas.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Tisn${rightSingleQuote}t the night before Christmas.`,
      "17"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a string`,
  (t) => {
    t.same(
      convertAll(`'Twill be the night before Christmas.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Twill be the night before Christmas.`,
      "18"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a string`,
  (t) => {
    t.same(
      convertAll(`'Twould be the night before Christmas.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Twould be the night before Christmas.`,
      "19"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a string`,
  (t) => {
    t.same(
      convertAll(`'Twere the night before Christmas, I would be happy.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Twere the night before Christmas, I would be happy.`,
      "20"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote in the front of a string`,
  (t) => {
    t.same(
      convertAll(`'Tweren't the night before Christmas, I would be happy.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Tweren${rightSingleQuote}t the night before Christmas, I would be happy.`,
      "21"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quotes wrapping word, ending in the middle`,
  (t) => {
    t.same(
      convertAll(`'Twon't be the night before Christmas.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}Twon${rightSingleQuote}t be the night before Christmas.`,
      "22"
    );
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quotes wrapping a word, ending in between words`,
  (t) => {
    t.same(
      convertAll(`'70s are my favorite numbers,' she said.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}70s are my favorite numbers,${rightSingleQuote} she said.`,
      "23"
    );
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - single quote on years`,
  (t) => {
    t.same(
      convertAll(`'70s fashion was weird.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `${rightSingleQuote}70s fashion was weird.`,
      "24"
    );
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - prime - inches`,
  (t) => {
    t.same(
      convertAll('12" record, 5\'10" height', {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `12${doublePrime} record, 5${singlePrime}10${doublePrime} height`,
      "25"
    );
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - prime - left type quote used`,
  (t) => {
    t.same(
      convertAll(`12" record, 5${leftSingleQuote}10${leftDoubleQuote} height`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `12${doublePrime} record, 5${singlePrime}10${doublePrime} height`,
      "26"
    );
    t.end();
  }
);

tap.test(
  `27 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - prime - right type quote used`,
  (t) => {
    t.same(
      convertAll(
        `12" record, 5${rightSingleQuote}10${rightDoubleQuote} height`,
        {
          convertApostrophes: 1,
          convertEntities: 0,
        }
      ).result,
      `12${doublePrime} record, 5${singlePrime}10${doublePrime} height`,
      "27"
    );
    t.end();
  }
);

tap.test(
  `28 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - word wrapped with double quotes in the end of a string`,
  (t) => {
    t.same(
      convertAll('Model "T2000"', {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `Model ${leftDoubleQuote}T2000${rightDoubleQuote}`,
      "28"
    );
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - plural`,
  (t) => {
    t.same(
      convertAll(`iPad 3's battery life is not great.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `iPad 3${rightSingleQuote}s battery life is not great.`,
      "29"
    );
    t.end();
  }
);

tap.test(
  `30 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - plural`,
  (t) => {
    t.same(
      convertAll(`Book 'em, Danno. Rock 'n' roll. 'Cause 'twas the season.`, {
        convertApostrophes: 1,
        convertEntities: 0,
      }).result,
      `Book ${rightSingleQuote}em, Danno. Rock ${rightSingleQuote}n${rightSingleQuote} roll. ${rightSingleQuote}Cause ${rightSingleQuote}twas the season.`,
      "30"
    );
    t.end();
  }
);

tap.test(
  `31 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - left type used`,
  (t) => {
    t.same(
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
    t.end();
  }
);

tap.test(
  `32 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - right type used`,
  (t) => {
    t.same(
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
    t.end();
  }
);

tap.test(
  `33 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - left type used`,
  (t) => {
    t.same(
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
    t.end();
  }
);

tap.test(
  `34 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - right type used`,
  (t) => {
    t.same(
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
    t.end();
  }
);

tap.test(
  `35 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - mixed quotes within a single sentence`,
  (t) => {
    t.same(
      convertAll(
        `"Hello," said the spider. "'Shelob'" abruptly she announced.`,
        {
          convertApostrophes: 1,
          convertEntities: 0,
        }
      ).result,
      `${leftDoubleQuote}Hello,${rightDoubleQuote} said the spider. ${leftDoubleQuote}${leftSingleQuote}Shelob${rightSingleQuote}${rightDoubleQuote} abruptly she announced.`,
      "35"
    );
    t.end();
  }
);

tap.test(
  `36 - ${`\u001b[${32}m${`kemitchell/straight-to-curly-quotes`}\u001b[${39}m`} - all off, nothing fancy to start with`,
  (t) => {
    const input = `"Hello," said the spider. "'Shelob'" abruptly she announced.`;
    t.same(
      convertAll(input, {
        convertApostrophes: 0,
        convertEntities: 0,
      }).result,
      input,
      "36"
    );
    t.end();
  }
);
