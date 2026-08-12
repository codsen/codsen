import { strict as assert } from "node:assert";

import { setAllValuesTo } from "../dist/object-set-all-values-to.esm.js";

const result = setAllValuesTo({ left: 1, right: 2 }, undefined);

assert.equal(Object.hasOwn(result, "left"), true);
assert.equal(result.left, undefined);
assert.equal(result.right, undefined);
