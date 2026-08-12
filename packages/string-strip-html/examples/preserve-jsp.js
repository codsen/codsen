// Leave JSP scriptlets intact while stripping HTML

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

const input = "a<% if (enabled) { %>b<% } %>c";

assert.equal(stripHtml(input).result, input);
