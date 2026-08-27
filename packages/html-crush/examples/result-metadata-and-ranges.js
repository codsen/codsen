// Inspect result metadata and edit ranges

import { strict as assert } from "node:assert";

import { crush } from "../dist/html-crush.esm.js";

const source = " <p> x </p> ";
const result = crush(source);

assert.equal(result.result, "<p> x </p>");
assert.equal(result.log.originalLength, source.length);
assert.equal(result.log.cleanedLength, result.result.length);
assert.equal(result.log.originalLengthInCodeUnits, 12);
assert.equal(result.log.cleanedLengthInCodeUnits, 10);
assert.equal(result.log.codeUnitsSaved, 2);
assert.equal(result.log.originalLengthInUtf8Bytes, 12);
assert.equal(result.log.cleanedLengthInUtf8Bytes, 10);
assert.equal(result.log.utf8BytesSaved, 2);
assert.deepEqual(result.ranges, [
  [0, 1],
  [11, 12],
]);
