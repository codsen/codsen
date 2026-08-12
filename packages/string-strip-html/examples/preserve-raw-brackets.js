// Preserve literal comparison brackets in plain text

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

assert.equal(stripHtml("a < b and c > d").result, "a < b and c > d");
