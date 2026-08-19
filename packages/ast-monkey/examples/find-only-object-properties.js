// Search object properties only

import { strict as assert } from "node:assert";

import { find } from "../dist/ast-monkey.esm.js";

const findings = find(
  { objectValue: "remove", items: ["keep", "remove"] },
  { val: "remove", only: "object" },
);

assert.equal(findings.length, 1);
assert.equal(findings[0].key, "objectValue");
