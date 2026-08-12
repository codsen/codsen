// Pass through non-string input

import { strict as assert } from "node:assert";

import { collWhitespace } from "../dist/string-collapse-leading-whitespace.esm.js";

const value = { untouched: true };

assert.equal(collWhitespace(value), value);
