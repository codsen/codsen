// Custom line-number padding

import { strict as assert } from "node:assert";

import { fixRowNums } from "../dist/js-row-num.esm.js";

assert.equal(
  fixRowNums("console.log(`9 first`)\nconsole.log(`8 second`)", {
    padStart: 5,
  }).result,
  "console.log(`00001 first`)\nconsole.log(`00002 second`)",
);
