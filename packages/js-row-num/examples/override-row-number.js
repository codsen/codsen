// Override every detected row number

import { strict as assert } from "node:assert";

import { fixRowNums } from "../dist/js-row-num.esm.js";

assert.equal(
  fixRowNums("console.log(`9 first`)\nconsole.log(`8 second`)", {
    overrideRowNum: 42,
  }).result,
  "console.log(`042 first`)\nconsole.log(`042 second`)",
);
