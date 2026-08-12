// Preserve an empty names array

import { strict as assert } from "node:assert";

import { uglifyArr } from "../dist/string-uglify.esm.js";

assert.deepEqual(uglifyArr([]), []);
