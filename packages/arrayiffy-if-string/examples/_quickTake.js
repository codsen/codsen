// Quick Take

import { strict as assert } from "assert";

import { arrayiffy } from "../dist/arrayiffy-if-string.esm.js";

assert.deepEqual(arrayiffy("aaa"), ["aaa"]);

assert.deepEqual(arrayiffy(""), []);

assert.equal(arrayiffy(true), true);

assert.equal(arrayiffy(), undefined);
