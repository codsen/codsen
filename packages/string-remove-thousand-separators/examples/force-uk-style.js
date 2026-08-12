// Convert a comma decimal separator to a dot

import { strict as assert } from "node:assert";

import { remSep } from "../dist/string-remove-thousand-separators.esm.js";

assert.equal(remSep("100 000,9", { forceUKStyle: true }), "100000.90");
