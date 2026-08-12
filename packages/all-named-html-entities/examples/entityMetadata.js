// Inspect entity-name metadata

import { strict as assert } from "node:assert";

import {
  brokenNamedEntities,
  maxLength,
  minLength,
  uncertain,
} from "../dist/all-named-html-entities.esm.js";

assert.equal(minLength, 2);
assert.equal(maxLength, 31);
assert.equal(typeof brokenNamedEntities, "object");
assert.equal(uncertain.Alpha.addAmpIfSemiPresent, false);
assert.equal(uncertain.Alpha.addSemiIfAmpPresent, "edge only");
