// Remove spaced thousand separators when no decimal separator is present

import { strict as assert } from "node:assert";

import { remSep } from "../dist/string-remove-thousand-separators.esm.js";

assert.equal(remSep("100 000 000 000"), "100000000000");
