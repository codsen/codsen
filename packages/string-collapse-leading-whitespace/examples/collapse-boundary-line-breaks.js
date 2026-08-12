// Collapse boundary whitespace containing line breaks

import { strict as assert } from "node:assert";

import { collWhitespace } from "../dist/string-collapse-leading-whitespace.esm.js";

assert.equal(collWhitespace("     \n\n   aaa  \n\n\n    "), "\naaa\n");
