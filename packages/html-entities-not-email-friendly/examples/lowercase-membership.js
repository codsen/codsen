// Check entity names case-insensitively with the lowercase set

import { strict as assert } from "node:assert";

import { notEmailFriendlyLowercaseSetOnly } from "../dist/html-entities-not-email-friendly.esm.js";

assert.equal(notEmailFriendlyLowercaseSetOnly.has("greatertilde"), true);
