/* eslint-disable no-unused-vars */
// Quick Take

import { strict as assert } from "assert";

import {
  notEmailFriendly,
  notEmailFriendlySetOnly,
  notEmailFriendlyLowercaseSetOnly,
  notEmailFriendlyMinLength,
  notEmailFriendlyMaxLength,
} from "../dist/html-entities-not-email-friendly.esm.js";

// it's object, mapping entity names to numeric equivalents
assert.equal(Object.keys(notEmailFriendly).length, 1841);

// it's a Set, only listing the bad entity names
assert.equal(notEmailFriendlySetOnly.size, 1841);

// is &GreaterTilde; email-friendly?
assert.equal(notEmailFriendlySetOnly.has("GreaterTilde"), true);
// no, use numeric entity

// is &nbsp; email-friendly?
assert.equal(notEmailFriendlySetOnly.has("nbsp"), false);
// yes, it's OK
