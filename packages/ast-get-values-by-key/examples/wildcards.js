// Using wildcards (`matcher` api)

import { strict as assert } from "assert";

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

// Two input arguments - getter:
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

// notice the path "nested.0.cutticles" is as per object-path notation -
// it's not "nested[0].cutticles" as in "normal" JS paths

// Three input arguments - setter:
assert.deepEqual(getByKey(source, ["*cles"], ["a", "b", "c"]), {
  popsicles: "a",
  tentacles: "b",
  nested: [
    {
      cutticles: "c",
    },
  ],
});
