// Keep thousand separators while still normalising the outer quotes

import { strict as assert } from "node:assert";

import { remSep } from "../dist/string-remove-thousand-separators.esm.js";

assert.equal(
  remSep('"1,000,000.00"', { removeThousandSeparatorsFromNumbers: false }),
  "1,000,000.00",
);
