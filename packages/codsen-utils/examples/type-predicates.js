// Check common JavaScript value types

import { strict as assert } from "node:assert";

import {
  isBool,
  isInt,
  isNull,
  isNum,
  isRegExp,
  isStr,
} from "../dist/codsen-utils.esm.js";

assert.equal(isStr("value"), true);
assert.equal(isNum(1.5), true);
assert.equal(isNum(Number.NaN), false);
assert.equal(isInt(3), true);
assert.equal(isInt(-1), false);
assert.equal(isBool(false), true);
assert.equal(isNull(null), true);
assert.equal(isRegExp(/value/), true);
