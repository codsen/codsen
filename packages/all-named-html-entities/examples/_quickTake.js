/* eslint-disable no-unused-vars */
// Quick Take

import { strict as assert } from "assert";

import {
  allNamedEntities,
  allNamedEntitiesSetOnly,
  allNamedEntitiesSetOnlyCaseInsensitive,
  entStartsWith,
  entEndsWith,
  entStartsWithCaseInsensitive,
  entEndsWithCaseInsensitive,
  brokenNamedEntities,
  decode,
  minLength,
  maxLength,
  uncertain,
} from "../dist/all-named-html-entities.esm.js";

assert.equal(Object.keys(allNamedEntities).length, 2125);
assert.equal(entStartsWith.A.E[0], "AElig");
