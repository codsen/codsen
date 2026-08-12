// Request one replacement space when deletion would join words

import { strict as assert } from "node:assert";

import { expander } from "../dist/string-range-expander.esm.js";

assert.deepEqual(
  expander({
    str: "first second",
    from: 5,
    to: 6,
    addSingleSpaceToPreventAccidentalConcatenation: true,
  }),
  [5, 6, " "],
);
