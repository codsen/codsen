// Convert a letter range into an en dash

import { strict as assert } from "node:assert";

import { convertAll } from "../dist/string-dashes.esm.js";

assert.equal(convertAll("An A-Z guide").result, "An A\u2013Z guide");
