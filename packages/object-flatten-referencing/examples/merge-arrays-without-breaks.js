// Merge array rows without inserting line breaks

import { strict as assert } from "node:assert";

import { flattenArr } from "../dist/object-flatten-referencing.esm.js";

assert.equal(
  flattenArr(["one", "two"], { mergeArraysWithLineBreaks: false }, false, true),
  "onetwo",
);
