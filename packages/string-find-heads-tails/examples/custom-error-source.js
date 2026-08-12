// Prefix validation errors with the calling library's name

import { strict as assert } from "node:assert";

import { strFindHeadsTails } from "../dist/string-find-heads-tails.esm.js";

assert.throws(
  () =>
    strFindHeadsTails("before {{ unfinished", "{{", "}}", {
      source: "template-audit",
    }),
  /template-audit/u,
);
