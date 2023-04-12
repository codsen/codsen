import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { leftDoubleQuote, rightDoubleQuote } from "codsen-utils";

import { convertAll } from "../dist/string-apostrophes.esm.js";

test(`01 - ${`\u001b[${35}m${"various"}\u001b[${39}m`} - edge cases`, () => {
  let input = '" " ';
  equal(
    convertAll(input, {
      convertApostrophes: 0,
      convertEntities: 0,
    }).result,
    input,
    "01.01"
  );
});

test(`02 - ${`\u001b[${35}m${"various"}\u001b[${39}m`} - edge cases`, () => {
  let input = ' " " ';
  equal(
    convertAll(input, {
      convertApostrophes: 0,
      convertEntities: 0,
    }).result,
    input,
    "02.01"
  );
});

test(`03 - ${`\u001b[${35}m${"various"}\u001b[${39}m`} - edge cases`, () => {
  let input = ' " "';
  equal(
    convertAll(input, {
      convertApostrophes: 0,
      convertEntities: 0,
    }).result,
    input,
    "03.01"
  );
});

test(`04 - ${`\u001b[${35}m${"various"}\u001b[${39}m`} - edge cases`, () => {
  let input = ` ${leftDoubleQuote}-${rightDoubleQuote} `;
  equal(
    convertAll(input, {
      convertApostrophes: 0,
      convertEntities: 0,
    }).result,
    ' "-" ',
    "04.01"
  );
});

test(`05 - ${`\u001b[${35}m${"various"}\u001b[${39}m`} - target 776`, () => {
  let input = ` a${rightDoubleQuote}`;
  equal(
    convertAll(input, {
      convertApostrophes: 0,
      convertEntities: 0,
    }).result,
    ' a"',
    "05.01"
  );
});

test.run();
