// Remove spaces used as thousand separators

import { strict as assert } from "node:assert";

import { remSep } from "../dist/string-remove-thousand-separators.esm.js";

assert.equal(remSep("1 000 000,00"), "1000000,00");
