// Start looking for marker pairs at a selected index

import { strict as assert } from "node:assert";

import { strFindHeadsTails } from "../dist/string-find-heads-tails.esm.js";

assert.deepEqual(
  strFindHeadsTails("{{ first }} and {{ second }}", "{{", "}}", {
    fromIndex: 14,
  }),
  [
    {
      headsStartAt: 16,
      headsEndAt: 18,
      tailsStartAt: 26,
      tailsEndAt: 28,
    },
  ],
);
