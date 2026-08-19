// Convert a maths minus into an en dash

import { strict as assert } from "node:assert";

import { convertAll } from "../dist/string-dashes.esm.js";

assert.equal(convertAll("5 - 2 = 3").result, "5 \u2013 2 = 3");
