// deps
import { strict as assert } from "node:assert";
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { compare } from "../dist/ast-compare.esm.js";

const callerDir = path.resolve(".");

const superset = [
  { metadata: { name: "alpha" } },
  { metadata: { name: "alpine" } },
  { metadata: { name: "beta" } },
  { metadata: { name: "bravo" } },
  { metadata: { name: "charlie" } },
  { metadata: { name: "delta" } },
  { metadata: { name: "echo" } },
  { metadata: { name: "foxtrot" } },
];
const subset = [
  { metadata: { name: "*" } },
  { metadata: { name: "alpha" } },
  { metadata: { name: "b*" } },
  { metadata: { name: "charlie" } },
  { metadata: { name: "delta" } },
  { metadata: { name: "echo" } },
];

const testme = () =>
  compare(superset, subset, {
    arrayOrder: "any",
    useWildcards: true,
  });

// action
assert.equal(testme(), true);
runPerf(testme, callerDir);
