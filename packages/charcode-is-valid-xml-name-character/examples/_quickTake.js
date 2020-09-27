/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import {
  isProduction4,
  isProduction4a,
  validFirstChar,
  validSecondCharOnwards,
} from "../dist/charcode-is-valid-xml-name-character.esm.js";

// Spec: https://www.w3.org/TR/REC-xml/#NT-NameStartChar

assert.equal(isProduction4("Z"), true);
assert.equal(isProduction4("?"), false);

assert.equal(isProduction4a("?"), false);
assert.equal(isProduction4a("-"), true);

assert.equal(validFirstChar("a"), true);
assert.equal(validFirstChar("1"), false);

assert.equal(validSecondCharOnwards("a"), true);
assert.equal(validSecondCharOnwards("?"), false);
