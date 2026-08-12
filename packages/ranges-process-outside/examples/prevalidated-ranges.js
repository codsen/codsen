// Skip range validation in a prevalidated pipeline

import { strict as assert } from "node:assert";

import { rProcessOutside } from "../dist/ranges-process-outside.esm.js";

const indexes = [];
rProcessOutside("abcdef", [[1, 3]], (from) => indexes.push(from), true);

assert.deepEqual(indexes, [0, 3, 4, 5]);
