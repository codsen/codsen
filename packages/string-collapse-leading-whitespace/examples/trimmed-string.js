// Preserve a string that has no boundary whitespace

import { strict as assert } from "node:assert";

import { collWhitespace } from "../dist/string-collapse-leading-whitespace.esm.js";

assert.equal(collWhitespace("aaa"), "aaa");
