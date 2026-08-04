// Quick Take

import { strict as assert } from "node:assert";

import { isNumberChar } from "../dist/codsen-utils.esm.js";

assert.equal(isNumberChar("z"), false);
assert.equal(isNumberChar("0"), true);
