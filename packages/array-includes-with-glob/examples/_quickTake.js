/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import includesWithGlob from "../dist/array-includes-with-glob.esm.js";

assert.equal(includesWithGlob(["xc", "yc", "zc"], "*c"), true);
// (all 3)

assert.equal(includesWithGlob(["xc", "yc", "zc"], "*a"), false);
// (none found)

assert.equal(includesWithGlob(["something", "anything", "zzz"], "some*"), true);
// (1 hit)
