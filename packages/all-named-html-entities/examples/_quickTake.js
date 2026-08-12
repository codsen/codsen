// Quick Take

import { strict as assert } from "node:assert";

import { allNamedEntities } from "../dist/all-named-html-entities.esm.js";

assert.equal(allNamedEntities.AElig, "Æ");
