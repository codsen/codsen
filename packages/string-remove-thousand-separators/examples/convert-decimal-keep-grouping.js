// Convert decimal commas while retaining grouping separators

import { strict as assert } from "node:assert";

import { remSep } from "../dist/string-remove-thousand-separators.esm.js";

assert.equal(
  remSep("1 234,50", {
    removeThousandSeparatorsFromNumbers: false,
    forceUKStyle: true,
  }),
  "1 234.50",
);
