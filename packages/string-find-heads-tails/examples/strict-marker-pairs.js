// Require each opening marker to use the tail at the same array index

import { strict as assert } from "node:assert";

import { strFindHeadsTails } from "../dist/string-find-heads-tails.esm.js";

assert.throws(
  () =>
    strFindHeadsTails(
      "before %%_value-%% after",
      ["%%_", "%%-"],
      ["_%%", "-%%"],
      { matchHeadsAndTailsStrictlyInPairsByTheirOrder: true },
    ),
  /THROW_ID_17/u,
);
