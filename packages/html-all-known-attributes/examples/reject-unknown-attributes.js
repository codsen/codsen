// Distinguish known attributes from application-specific ones

import { strict as assert } from "node:assert";

import { allHtmlAttribs } from "../dist/html-all-known-attributes.esm.js";

assert.equal(allHtmlAttribs.has("class"), true);
assert.equal(allHtmlAttribs.has("data-project-specific"), false);
