// Arrays containing the placeholder itself

import { strict as assert } from "node:assert";

import { allEq } from "../dist/object-all-values-equal-to.esm.js";

// By default, a placeholder directly inside an array makes the result false.
assert.equal(allEq([false, false], false), false);

assert.equal(
  allEq([false, false], false, { arraysMustNotContainPlaceholders: false }),
  true,
);
