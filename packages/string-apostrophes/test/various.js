// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { leftDoubleQuote, rightDoubleQuote } from "codsen-utils";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { convertAll } from "../dist/string-apostrophes.esm.js";

test(`01 - various - edge cases`, () => {
  let input = '" " ';
  equal(
    convertAll(input, {
      convertApostrophes: 0,
      convertEntities: 0,
    }).result,
    input,
    "01.01",
  );
});

test(`02 - various - edge cases`, () => {
  let input = ' " " ';
  equal(
    convertAll(input, {
      convertApostrophes: 0,
      convertEntities: 0,
    }).result,
    input,
    "02.01",
  );
});

test(`03 - various - edge cases`, () => {
  let input = ' " "';
  equal(
    convertAll(input, {
      convertApostrophes: 0,
      convertEntities: 0,
    }).result,
    input,
    "03.01",
  );
});

test(`04 - various - edge cases`, () => {
  let input = ` ${leftDoubleQuote}-${rightDoubleQuote} `;
  equal(
    convertAll(input, {
      convertApostrophes: 0,
      convertEntities: 0,
    }).result,
    ' "-" ',
    "04.01",
  );
});

test(`05 - various - target 776`, () => {
  let input = ` a${rightDoubleQuote}`;
  equal(
    convertAll(input, {
      convertApostrophes: 0,
      convertEntities: 0,
    }).result,
    ' a"',
    "05.01",
  );
});

test.run();
