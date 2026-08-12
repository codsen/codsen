import { strict as assert } from "node:assert";

import { find } from "../dist/ast-monkey.esm.js";

const findings = find(
  {
    primary: { status: "ready" },
    fallback: { status: "waiting" },
  },
  { key: null, val: { status: "ready" } },
);

assert.equal(findings.length, 1);
assert.equal(findings[0].key, "primary");
assert.equal(findings[0].index, 1);
