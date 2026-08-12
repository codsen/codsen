// Strip an HTML comment and prevent adjacent text from joining

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

assert.equal(stripHtml("before<!-- hidden -->after").result, "before after");
