// Repair repeatedly encoded entities

import { strict as assert } from "node:assert";

import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

assert.deepEqual(fixEnt("text&amp;amp;nbsp;text"), [[4, 18, "&nbsp;"]]);
