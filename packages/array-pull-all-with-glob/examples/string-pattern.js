// Pass one removal pattern as a string

import { strict as assert } from "node:assert";

import { pull } from "../dist/array-pull-all-with-glob.esm.js";

assert.deepEqual(pull(["keep", "temp-1", "temp-2"], "temp-*"), ["keep"]);
