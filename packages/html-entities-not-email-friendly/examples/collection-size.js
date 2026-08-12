// Inspect the number of known unsafe named entities

import { strict as assert } from "node:assert";

import {
  notEmailFriendly,
  notEmailFriendlySetOnly,
} from "../dist/html-entities-not-email-friendly.esm.js";

assert.equal(Object.keys(notEmailFriendly).length, 1841);
assert.equal(notEmailFriendlySetOnly.size, 1841);
