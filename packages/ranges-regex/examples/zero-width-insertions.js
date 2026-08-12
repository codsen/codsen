// Turn zero-width matches into insertion ranges

import { strict as assert } from "node:assert";

import { rRegex } from "../dist/ranges-regex.esm.js";

assert.deepEqual(rRegex(/(?:)/gu, "ab", "|"), [
  [0, 0, "|"],
  [1, 1, "|"],
  [2, 2, "|"],
]);
