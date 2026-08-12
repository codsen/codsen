// Using wildcard patterns

import { strict as assert } from "node:assert";

import { getByKey } from "../dist/ast-get-values-by-key.esm.js";

const source = {
  popsicles: 1,
  tentacles: 0,
  nested: [
    {
      cutticles: "yes",
    },
  ],
};

const findings = getByKey(source, ["*cles"]);

assert.deepEqual(findings, [
  {
    val: 1,
    path: "popsicles",
  },
  {
    val: 0,
    path: "tentacles",
  },
  {
    val: "yes",
    path: "nested.0.cutticles",
  },
]);
