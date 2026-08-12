// Find entity names by a case-insensitive suffix

import { strict as assert } from "node:assert";

import { entEndsWithCaseInsensitive } from "../dist/all-named-html-entities.esm.js";

assert.deepEqual(entEndsWithCaseInsensitive.u.m, ["mu"]);
