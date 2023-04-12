// Quick Take

import { strict as assert } from "assert";

import { isMediaD } from "../dist/is-media-descriptor.esm.js";

assert.deepEqual(isMediaD("screeen"), [
  {
    idxFrom: 0,
    idxTo: 7,
    message: 'Did you mean "screen"?',
    fix: {
      ranges: [[0, 7, "screen"]],
    },
  },
]);
