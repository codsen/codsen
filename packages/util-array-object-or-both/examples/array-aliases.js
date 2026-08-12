// Normalise the accepted array aliases

import { strict as assert } from "node:assert";

import { arrObjOrBoth } from "../dist/util-array-object-or-both.esm.js";

assert.equal(arrObjOrBoth("arrays"), "array");
assert.equal(arrObjOrBoth("array"), "array");
assert.equal(arrObjOrBoth("arr"), "array");
assert.equal(arrObjOrBoth("a"), "array");
