// Test whether a name is a known entity

import { strict as assert } from "node:assert";

import {
  allNamedEntitiesSetOnly,
  allNamedEntitiesSetOnlyCaseInsensitive,
} from "../dist/all-named-html-entities.esm.js";

assert.equal(allNamedEntitiesSetOnly.has("AElig"), true);
assert.equal(allNamedEntitiesSetOnly.has("aelig"), true);
assert.equal(allNamedEntitiesSetOnlyCaseInsensitive.has("aelig"), true);
assert.equal(allNamedEntitiesSetOnlyCaseInsensitive.has("AElig"), false);
