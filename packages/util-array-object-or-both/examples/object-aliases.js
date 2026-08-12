// Normalise the accepted object aliases

import { strict as assert } from "node:assert";

import { arrObjOrBoth } from "../dist/util-array-object-or-both.esm.js";

assert.equal(arrObjOrBoth("objects"), "object");
assert.equal(arrObjOrBoth("object"), "object");
assert.equal(arrObjOrBoth("obj"), "object");
assert.equal(arrObjOrBoth("o"), "object");
