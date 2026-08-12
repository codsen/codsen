// Give deletion precedence with a null replacement

import { strict as assert } from "node:assert";

import { rRegex } from "../dist/ranges-regex.esm.js";

assert.deepEqual(rRegex(/\b0+\b/gu, "10 000 20", null), [[3, 6, null]]);
