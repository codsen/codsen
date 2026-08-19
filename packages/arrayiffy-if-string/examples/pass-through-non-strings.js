// Pass non-string values through untouched

import { strict as assert } from "node:assert";

import { arrayiffy } from "../dist/arrayiffy-if-string.esm.js";

const config = { enabled: true };

assert.equal(arrayiffy(config), config);
assert.equal(arrayiffy(42), 42);
assert.equal(arrayiffy(null), null);
