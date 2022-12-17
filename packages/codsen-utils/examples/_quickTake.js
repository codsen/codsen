// Quick Take

import { strict as assert } from "assert";

import { isNumber } from "../dist/codsen-utils.esm.js";

assert.equal(isNumber("z"), false);
assert.equal(isNumber("0"), true);
