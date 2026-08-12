// Return an empty result for unusable marker inputs

import { strict as assert } from "node:assert";

import { strFindHeadsTails } from "../dist/string-find-heads-tails.esm.js";

assert.deepEqual(
  strFindHeadsTails("before {{ value }}", [], "}}", { relaxedAPI: true }),
  [],
);
