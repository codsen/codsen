// Preserve a separator between international words

import { strict as assert } from "node:assert";

import { expander } from "../dist/string-range-expander.esm.js";

assert.deepEqual(
  expander({
    str: "你 你",
    from: 1,
    to: 2,
    addSingleSpaceToPreventAccidentalConcatenation: true,
  }),
  [1, 2, " "],
);
