// Quick Take

import { strict as assert } from "node:assert";

import {
  allNamedEntities,
  allNamedEntitiesSetOnly,
  allNamedEntitiesSetOnlyCaseInsensitive,
  brokenNamedEntities,
  decode,
  entEndsWith,
  entEndsWithCaseInsensitive,
  entStartsWith,
  entStartsWithCaseInsensitive,
  maxLength,
  minLength,
  uncertain,
} from "../dist/all-named-html-entities.esm.js";

assert.equal(Object.keys(allNamedEntities).length, 2125);
assert.equal(entStartsWith.A.E[0], "AElig");
