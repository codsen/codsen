// Advance over a complete Unicode code point after an empty match

import { strict as assert } from "node:assert";

import { rRegex } from "../dist/ranges-regex.esm.js";

assert.deepEqual(rRegex(/(?:)/gu, "😀", "|"), [
  [0, 0, "|"],
  [2, 2, "|"],
]);
