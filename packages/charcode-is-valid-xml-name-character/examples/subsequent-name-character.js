// Validate a character after the first character in an XML name

import { strict as assert } from "node:assert";

import { validSecondCharOnwards } from "../dist/charcode-is-valid-xml-name-character.esm.js";

assert.equal(validSecondCharOnwards("a"), true);
assert.equal(validSecondCharOnwards("?"), false);
