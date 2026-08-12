// Quick Take

import { strict as assert } from "node:assert";

import { notEmailFriendlySetOnly } from "../dist/html-entities-not-email-friendly.esm.js";

assert.equal(notEmailFriendlySetOnly.has("GreaterTilde"), true);
assert.equal(notEmailFriendlySetOnly.has("nbsp"), false);
