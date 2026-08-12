// Remove every value with the catch-all glob

import { strict as assert } from "node:assert";

import { pull } from "../dist/array-pull-all-with-glob.esm.js";

assert.deepEqual(pull(["one", "two", "three"], "*"), []);
