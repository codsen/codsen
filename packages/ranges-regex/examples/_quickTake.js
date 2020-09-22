/* eslint import/extensions:0, no-unused-vars:0 */

// Quick Take

import { strict as assert } from "assert";
import raReg from "../dist/ranges-regex.esm.js";

const oldString = `The quick brown fox jumps over the lazy dog.`;
const result = raReg(/the/gi, oldString);

// all regex matches, but in Ranges notation (see codsen.com/ranges/):
assert.deepEqual(result, [
  [0, 3],
  [31, 34],
]);

// if you slice the ranges, you'll get original regex caught values:
assert.deepEqual(
  result.map(([from, to]) => oldString.slice(from, to)),
  ["The", "the"]
);
