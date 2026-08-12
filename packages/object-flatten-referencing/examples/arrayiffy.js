// Normalise a string setting to an array

import { strict as assert } from "node:assert";

import { arrayiffy } from "../dist/object-flatten-referencing.esm.js";

assert.deepEqual(arrayiffy("title"), ["title"]);
