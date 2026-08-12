// Quick Take

import { strict as assert } from "node:assert";

import { includesWithGlob } from "../dist/array-includes-with-glob.esm.js";

assert.equal(includesWithGlob(["xc", "yc", "zc"], "*c"), true);
