// Classify individual characters

import { strict as assert } from "node:assert";

import {
  isCurrencyChar,
  isCurrencySymbol,
  isLatinLetter,
  isLetter,
  isLowercaseLetter,
  isNumberChar,
  isQuote,
  isUppercaseLetter,
  isWhitespaceChar,
} from "../dist/codsen-utils.esm.js";

assert.equal(isNumberChar("7"), true);
assert.equal(isCurrencyChar("£"), true);
assert.equal(isCurrencyChar("CHF"), false);
assert.equal(isCurrencySymbol("CHF"), true);
assert.equal(isLetter("Ж"), true);
assert.equal(isLatinLetter("Ж"), false);
assert.equal(isQuote("”"), true);
assert.equal(isLowercaseLetter("ž"), true);
assert.equal(isUppercaseLetter("Ž"), true);
assert.equal(isWhitespaceChar("\u00A0"), true);
