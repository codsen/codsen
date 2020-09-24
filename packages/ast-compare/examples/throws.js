/* eslint import/extensions:0 */

// Throw Errors

import { strict as assert } from "assert";
import compare from "../dist/ast-compare.esm.js";

// second input argument can't be missing:
assert.throws(() => compare({ a: "a" }), TypeError);
assert.throws(() => compare(null), TypeError);
