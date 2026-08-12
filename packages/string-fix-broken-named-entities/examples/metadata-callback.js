// Map findings into custom callback results

import { strict as assert } from "node:assert";

import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

assert.deepEqual(
  fixEnt("before &nsp; after", {
    cb: (finding) => ({
      rule: finding.ruleName,
      replacement: finding.rangeValEncoded,
      from: finding.rangeFrom,
      to: finding.rangeTo,
    }),
  }),
  [
    {
      rule: "bad-html-entity-malformed-nbsp",
      replacement: "&nbsp;",
      from: 7,
      to: 12,
    },
  ],
);
