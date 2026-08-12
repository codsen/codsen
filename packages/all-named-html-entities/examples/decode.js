// Decode a named HTML entity

import { strict as assert } from "node:assert";

import { decode } from "../dist/all-named-html-entities.esm.js";

assert.equal(decode("&aleph;"), "ℵ");
assert.equal(decode("&notARealEntity;"), null);
