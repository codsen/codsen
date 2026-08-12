// Replace all previously gathered ranges

import { strict as assert } from "node:assert";

import { Ranges } from "../dist/ranges-push.esm.js";

const ranges = new Ranges();
ranges.add(1, 2);
ranges.replace([[3, 4, "X"]]);

assert.deepEqual(ranges.current(), [[3, 4, "X"]]);
