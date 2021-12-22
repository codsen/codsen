// Quick Take

import { strict as assert } from "assert";

import {
  isHighSurrogate,
  isLowSurrogate,
} from "../dist/string-character-is-astral-surrogate.esm.js";

// 🧢 = \uD83E\uDDE2

assert.equal(isHighSurrogate("\uD83E"), true);
// the first character, high surrogate of the cap is indeed a high surrogate

assert.equal(isHighSurrogate("\uDDE2"), false);
// the second character, low surrogate of the cap is NOT a high surrogate

assert.equal(isLowSurrogate("\uD83E"), false);
// the first character, high surrogate of the cap is NOT a low surrogate
// it's a high surrogate

assert.equal(isLowSurrogate("\uDDE2"), true);
// the second character, low surrogate of the cap is indeed a low surrogate
