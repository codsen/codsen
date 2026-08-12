// Read the most recently gathered range

import { strict as assert } from "node:assert";

import { Ranges } from "../dist/ranges-push.esm.js";

const ranges = new Ranges();
ranges.add(1, 2);
ranges.add(4, 6, "X");

assert.deepEqual(ranges.last(), [4, 6, "X"]);
