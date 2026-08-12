// Reject an input made only from one opening marker

import { strict as assert } from "node:assert";

import { strFindHeadsTails } from "../dist/string-find-heads-tails.esm.js";

assert.throws(
  () =>
    strFindHeadsTails("{{", "{{", "}}", {
      allowWholeValueToBeOnlyHeadsOrTails: false,
    }),
  /THROW_ID_14/u,
);
