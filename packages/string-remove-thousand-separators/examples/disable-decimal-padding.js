// Leave a single decimal place unpadded

import { strict as assert } from "node:assert";

import { remSep } from "../dist/string-remove-thousand-separators.esm.js";

assert.equal(
  remSep("1,000.2", { padSingleDecimalPlaceNumbers: false }),
  "1000.2",
);
