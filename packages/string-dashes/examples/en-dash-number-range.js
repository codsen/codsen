// Convert a number range into an en dash

import { strict as assert } from "node:assert";

import { convertAll } from "../dist/string-dashes.esm.js";

assert.equal(convertAll("Read pages 10-12.").result, "Read pages 10\u201312.");
