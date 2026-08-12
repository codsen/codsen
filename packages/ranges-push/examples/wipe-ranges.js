// Clear every gathered range

import { strict as assert } from "node:assert";

import { Ranges } from "../dist/ranges-push.esm.js";

const ranges = new Ranges();
ranges.add(1, 2);
ranges.wipe();

assert.equal(ranges.current(), null);
