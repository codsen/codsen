// Return false when one value differs from the reference

import { strict as assert } from "node:assert";

import { allEq } from "../dist/object-all-values-equal-to.esm.js";

assert.equal(allEq({ a: false, c: "zzz" }, false), false);
