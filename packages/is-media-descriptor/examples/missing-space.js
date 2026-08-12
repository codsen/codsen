// Report missing descriptor whitespace

import { strict as assert } from "node:assert";

import { isMediaD } from "../dist/is-media-descriptor.esm.js";

assert.deepEqual(isMediaD("screen and(color)"), [
  {
    idxFrom: 7,
    idxTo: 10,
    message: 'Space after "and" missing.',
    fix: { ranges: [[10, 10, " "]] },
  },
]);
