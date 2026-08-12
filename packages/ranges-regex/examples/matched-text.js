// Slice the source text using the returned ranges

import { strict as assert } from "node:assert";

import { rRegex } from "../dist/ranges-regex.esm.js";

const source = "The quick brown fox jumps over the lazy dog.";
const ranges = rRegex(/the/gi, source);

assert.deepEqual(
  ranges.map(([from, to]) => source.slice(from, to)),
  ["The", "the"],
);
