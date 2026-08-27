// Preserve an empty names array

import { strict as assert } from "node:assert";

import { uglifyArr } from "../dist/string-uglify.esm.js";

const input = [];
const result = uglifyArr(input);

assert.deepEqual(result, []);
assert.notEqual(result, input);

result.push("changed");
assert.deepEqual(input, []);
