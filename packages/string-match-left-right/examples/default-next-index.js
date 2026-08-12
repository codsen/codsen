// Advance to the next string index

import { strict as assert } from "node:assert";

import { defaultGetNextIdx } from "../dist/string-match-left-right.esm.js";

assert.equal(defaultGetNextIdx(4), 5);
