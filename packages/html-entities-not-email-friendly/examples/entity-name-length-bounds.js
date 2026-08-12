// Skip impossible entity-name lengths before consulting the sets

import { strict as assert } from "node:assert";

import {
  notEmailFriendlyMaxLength,
  notEmailFriendlyMinLength,
} from "../dist/html-entities-not-email-friendly.esm.js";

assert.equal(notEmailFriendlyMinLength, 2);
assert.equal(notEmailFriendlyMaxLength, 31);
