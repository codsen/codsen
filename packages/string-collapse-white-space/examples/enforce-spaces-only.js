// Replace tabs inside whitespace runs with ordinary spaces

import { strict as assert } from "node:assert";

import { collapse } from "../dist/string-collapse-white-space.esm.js";

assert.equal(
  collapse("one\t\ttwo", { enforceSpacesOnly: true }).result,
  "one two",
);
assert.equal(
  collapse("one\t\ttwo", { enforceSpacesOnly: false }).result,
  "one\t\ttwo",
);
