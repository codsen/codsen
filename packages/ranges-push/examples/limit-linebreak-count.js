// Retain at most two line breaks in replacement whitespace

import { strict as assert } from "node:assert";

import { Ranges } from "../dist/ranges-push.esm.js";

const ranges = new Ranges({
  limitToBeAddedWhitespace: true,
  limitLinebreaksCount: 2,
});
ranges.add(1, 2, "\n\n\n");

assert.deepEqual(ranges.current(), [[1, 2, "\n\n"]]);
