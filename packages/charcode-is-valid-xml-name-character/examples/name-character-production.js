// Check characters against the XML NameChar production

import { strict as assert } from "node:assert";

import { isProduction4a } from "../dist/charcode-is-valid-xml-name-character.esm.js";

assert.equal(isProduction4a("?"), false);
assert.equal(isProduction4a("-"), true);
