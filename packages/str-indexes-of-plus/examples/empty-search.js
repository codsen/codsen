// Search for an empty string

import { strict as assert } from "node:assert";

import { strIndexesOfPlus } from "../dist/str-indexes-of-plus.esm.js";

assert.deepEqual(strIndexesOfPlus("content", ""), []);
