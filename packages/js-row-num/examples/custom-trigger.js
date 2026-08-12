// Custom logging trigger

import { strict as assert } from "node:assert";

import { fixRowNums } from "../dist/js-row-num.esm.js";

assert.equal(
  fixRowNums("logger(`1 first`)\nconsole.log(`2 second`)", {
    triggerKeywords: ["logger"],
  }).result,
  "logger(`001 first`)\nconsole.log(`2 second`)",
);
