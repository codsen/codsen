import { strict as assert } from "node:assert";

import { find } from "../dist/ast-monkey.esm.js";

const findings = find(
  {
    first: { status: "ready" },
    second: { status: "waiting" },
  },
  { key: "status", val: "ready" },
);

assert.equal(findings.length, 1);
assert.equal(findings[0].key, "status");
assert.equal(findings[0].val, "ready");
