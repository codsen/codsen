// Return a flattened clone without changing the input

import { strict as assert } from "node:assert";

import { flattenAllArrays } from "../dist/object-flatten-all-arrays.esm.js";

const input = { items: [{ a: 1 }, { b: 2 }] };

flattenAllArrays(input);

assert.deepEqual(input, { items: [{ a: 1 }, { b: 2 }] });
