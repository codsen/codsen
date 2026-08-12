// Pass through unsupported input values

import { strict as assert } from "node:assert";

import { conv } from "../dist/color-shorthand-hex-to-six-digit.esm.js";

assert.equal(conv(42), 42);
assert.equal(conv(null), null);
assert.equal(conv(true), true);
