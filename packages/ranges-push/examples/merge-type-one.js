// Concatenate replacement values when same-start ranges merge

import { strict as assert } from "node:assert";

import { Ranges } from "../dist/ranges-push.esm.js";

const ranges = new Ranges({ mergeType: 1 });
ranges.add(1, 4, "A");
ranges.add(1, 5, "B");

assert.deepEqual(ranges.current(), [[1, 5, "AB"]]);
