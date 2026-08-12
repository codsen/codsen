// Quick Take

import { strict as assert } from "node:assert";

import { validFirstChar } from "../dist/charcode-is-valid-xml-name-character.esm.js";

// Spec: https://www.w3.org/TR/REC-xml/#NT-NameStartChar

assert.equal(validFirstChar("a"), true);
assert.equal(validFirstChar("1"), false);
