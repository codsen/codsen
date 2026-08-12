// Decode HTML entities before recognising and stripping encoded tags

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

assert.equal(stripHtml("&lt;b&gt;bold&lt;/b&gt;").result, "bold");
