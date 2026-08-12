// Inspect result metadata and edit ranges

import { strict as assert } from "node:assert";

import { crush } from "../dist/html-crush.esm.js";

const source = " <p> x </p> ";
const result = crush(source);

assert.equal(result.result, "<p> x </p>");
assert.equal(result.log.originalLength, source.length);
assert.equal(result.log.cleanedLength, result.result.length);
assert.deepEqual(result.ranges, [
  [0, 1],
  [11, 12],
]);
