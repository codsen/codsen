// Preserve mappings for duplicate names

import { strict as assert } from "node:assert";

import { uglifyArr } from "../dist/string-uglify.esm.js";

const result = uglifyArr([".long-name", ".long-name", "#long-name"]);

assert.equal(result[0], result[1]);
assert.equal(result[0].startsWith("."), true);
assert.equal(result[2].startsWith("#"), true);
