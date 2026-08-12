// Check email-client-specific HTML attributes

import { strict as assert } from "node:assert";

import { allHtmlAttribs } from "../dist/html-all-known-attributes.esm.js";

assert.equal(allHtmlAttribs.has("mso-line-height-rule"), true);
assert.equal(allHtmlAttribs.has("vnd.ms-excel.numberformat"), true);
