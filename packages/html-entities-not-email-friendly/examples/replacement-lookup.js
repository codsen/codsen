// Look up a safer replacement for a named entity

import { strict as assert } from "node:assert";

import { notEmailFriendly } from "../dist/html-entities-not-email-friendly.esm.js";

assert.equal(notEmailFriendly.GreaterTilde, "#x2273");
