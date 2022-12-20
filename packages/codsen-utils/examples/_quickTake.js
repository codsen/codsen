// Quick Take

import { strict as assert } from "assert";

import { isNumberChar } from "../dist/codsen-utils.esm.js";

assert.equal(isNumberChar("z"), false);
assert.equal(isNumberChar("0"), true);
