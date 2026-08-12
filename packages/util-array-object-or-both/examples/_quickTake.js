// Quick Take

import { strict as assert } from "node:assert";

import { arrObjOrBoth } from "../dist/util-array-object-or-both.esm.js";

assert.equal(arrObjOrBoth("arrays"), "array");
