// Preserve a number whose separators are ambiguous

import { strict as assert } from "node:assert";

import { remSep } from "../dist/string-remove-thousand-separators.esm.js";

const input = "100,000,000.000";

assert.equal(remSep(input), input);
