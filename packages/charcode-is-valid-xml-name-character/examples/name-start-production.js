// Check characters against the XML NameStartChar production

import { strict as assert } from "node:assert";

import { isProduction4 } from "../dist/charcode-is-valid-xml-name-character.esm.js";

assert.equal(isProduction4("Z"), true);
assert.equal(isProduction4("?"), false);
