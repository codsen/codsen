// Crop tightly when a configured marker appears on the left

import { strict as assert } from "node:assert";

import { expander } from "../dist/string-range-expander.esm.js";

assert.deepEqual(
  expander({
    str: "a>     <b",
    from: 3,
    to: 6,
    ifLeftSideIncludesThisThenCropTightly: ">",
  }),
  [2, 7],
);
