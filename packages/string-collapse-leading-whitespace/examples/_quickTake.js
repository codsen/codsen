// Quick Take

import { strict as assert } from "node:assert";

import { collWhitespace } from "../dist/string-collapse-leading-whitespace.esm.js";

assert.equal(collWhitespace("  aaa   "), " aaa ");
