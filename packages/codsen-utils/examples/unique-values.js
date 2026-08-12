// Deduplicate values while preserving order

import { strict as assert } from "node:assert";

import { uniq } from "../dist/codsen-utils.esm.js";

assert.deepEqual(uniq(["b", "a", "b", "c", "a"]), ["b", "a", "c"]);
