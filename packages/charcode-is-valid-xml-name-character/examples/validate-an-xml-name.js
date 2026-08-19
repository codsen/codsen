// Validate a whole XML name

import { strict as assert } from "node:assert";

import {
  validFirstChar,
  validSecondCharOnwards,
} from "../dist/charcode-is-valid-xml-name-character.esm.js";

function isValidXmlName(name) {
  const [first, ...rest] = Array.from(name);
  return (
    Boolean(first) &&
    validFirstChar(first) &&
    rest.every(validSecondCharOnwards)
  );
}

assert.equal(isValidXmlName("article-1"), true);
assert.equal(isValidXmlName("1-article"), false);
