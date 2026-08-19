// An ambiguous hyphen is left alone

import { strict as assert } from "node:assert";

import { convertAll } from "../dist/string-dashes.esm.js";

assert.equal(convertAll("m-m").result, "m-m");
