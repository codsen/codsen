// Normalise aliases that allow either arrays or objects

import { strict as assert } from "node:assert";

import { arrObjOrBoth } from "../dist/util-array-object-or-both.esm.js";

assert.equal(arrObjOrBoth("whatever"), "any");
assert.equal(arrObjOrBoth("either"), "any");
assert.equal(arrObjOrBoth("both"), "any");
assert.equal(arrObjOrBoth("any"), "any");
assert.equal(arrObjOrBoth("all"), "any");
assert.equal(arrObjOrBoth("e"), "any");
