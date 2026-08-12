// Quick Take

import { strict as assert } from "node:assert";

import { arrayiffy } from "../dist/arrayiffy-if-string.esm.js";

assert.deepEqual(arrayiffy("aaa"), ["aaa"]);
