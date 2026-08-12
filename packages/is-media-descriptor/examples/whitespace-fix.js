// Report surrounding whitespace

import { strict as assert } from "node:assert";

import { isMediaD } from "../dist/is-media-descriptor.esm.js";

assert.deepEqual(isMediaD(" screen "), [
  {
    idxFrom: 0,
    idxTo: 8,
    message: "Remove whitespace.",
    fix: {
      ranges: [
        [0, 1],
        [7, 8],
      ],
    },
  },
]);
