// Treat a missing code unit as not being a surrogate

import { strict as assert } from "node:assert";

import {
  isHighSurrogate,
  isLowSurrogate,
} from "../dist/string-character-is-astral-surrogate.esm.js";

assert.equal(isHighSurrogate(undefined), false);
assert.equal(isLowSurrogate(undefined), false);
