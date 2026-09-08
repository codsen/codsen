// Pad one-digit fractions without losing precision

import { strict as assert } from "node:assert";

import { remSep } from "../dist/string-remove-thousand-separators.esm.js";

assert.equal(remSep("0.5"), "0.50");
assert.equal(remSep(".5", { padSingleDecimalPlaceNumbers: false }), ".5");
assert.equal(remSep("0,075", { forceUKStyle: true }), "0.075");
