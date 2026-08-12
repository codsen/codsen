// Process already-extracted log contents

import { strict as assert } from "node:assert";

import { fixRowNums } from "../dist/js-row-num.esm.js";

assert.equal(
  fixRowNums("`9 extracted content`", {
    extractedLogContentsWereGiven: true,
  }).result,
  "`001 extracted content`",
);
