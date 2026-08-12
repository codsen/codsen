import { strict as assert } from "node:assert";

import { arrObjOrBoth } from "../dist/util-array-object-or-both.esm.js";

assert.equal(arrObjOrBoth("  ARR\n"), "array");
assert.equal(arrObjOrBoth("\tObjects "), "object");
assert.equal(arrObjOrBoth(" EVERYTHING "), "any");
