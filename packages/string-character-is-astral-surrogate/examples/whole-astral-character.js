// Inspect the first UTF-16 code unit of an astral character

import { strict as assert } from "node:assert";

import {
  isHighSurrogate,
  isLowSurrogate,
} from "../dist/string-character-is-astral-surrogate.esm.js";

assert.equal(isHighSurrogate("🧢"), true);
assert.equal(isLowSurrogate("🧢"), false);
