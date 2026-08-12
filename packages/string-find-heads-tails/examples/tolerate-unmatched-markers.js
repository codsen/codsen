// Return completed pairs without throwing on an unmatched marker

import { strict as assert } from "node:assert";

import { strFindHeadsTails } from "../dist/string-find-heads-tails.esm.js";

assert.deepEqual(
  strFindHeadsTails("{{ complete }} and {{ unfinished", "{{", "}}", {
    throwWhenSomethingWrongIsDetected: false,
  }),
  [
    {
      headsStartAt: 0,
      headsEndAt: 2,
      tailsStartAt: 12,
      tailsEndAt: 14,
    },
  ],
);
