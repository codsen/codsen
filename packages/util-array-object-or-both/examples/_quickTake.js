// Quick Take

import { strict as assert } from "assert";
import { arrObjOrBoth } from "../dist/util-array-object-or-both.esm.js";

// normalises string, a user preference:

assert.equal(arrObjOrBoth("arrays"), "array");
assert.equal(arrObjOrBoth("array"), "array");
assert.equal(arrObjOrBoth("arr"), "array");
assert.equal(arrObjOrBoth("a"), "array");

assert.equal(arrObjOrBoth("objects"), "object");
assert.equal(arrObjOrBoth("object"), "object");
assert.equal(arrObjOrBoth("obj"), "object");
assert.equal(arrObjOrBoth("o"), "object");

assert.equal(arrObjOrBoth("whatever"), "any");
assert.equal(arrObjOrBoth("either"), "any");
assert.equal(arrObjOrBoth("both"), "any");
assert.equal(arrObjOrBoth("any"), "any");
assert.equal(arrObjOrBoth("all"), "any");
assert.equal(arrObjOrBoth("e"), "any");
