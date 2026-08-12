// Merge adjacent regex matches into one range

import { strict as assert } from "node:assert";

import { rRegex } from "../dist/ranges-regex.esm.js";

assert.deepEqual(rRegex(/ab/gu, "abab x ab"), [
  [0, 4],
  [7, 9],
]);
