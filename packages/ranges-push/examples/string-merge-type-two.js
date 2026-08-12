// Accept the string form of merge type two

import { strict as assert } from "node:assert";

import { Ranges } from "../dist/ranges-push.esm.js";

const ranges = new Ranges({ mergeType: "2" });
ranges.add(1, 4, "A");
ranges.add(1, 5, "B");

assert.deepEqual(ranges.current(), [[1, 5, "B"]]);
