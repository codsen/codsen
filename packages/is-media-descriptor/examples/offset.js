// Offset reported indexes

import { strict as assert } from "node:assert";

import { isMediaD } from "../dist/is-media-descriptor.esm.js";

// The descriptor starts at index 10 in a larger source string.
assert.deepEqual(isMediaD("screeen", { offset: 10 }), [
  {
    idxFrom: 10,
    idxTo: 17,
    message: 'Did you mean "screen"?',
    fix: { ranges: [[10, 17, "screen"]] },
  },
]);
