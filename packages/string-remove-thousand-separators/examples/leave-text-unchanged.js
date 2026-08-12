// Leave a value unchanged when it contains non-numeric text

import { strict as assert } from "node:assert";

import { remSep } from "../dist/string-remove-thousand-separators.esm.js";

const source = "The price is 1,999.9";

assert.equal(remSep(source), source);
