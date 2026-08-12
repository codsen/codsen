// Inspect the number of known attributes

import { strict as assert } from "node:assert";

import { allHtmlAttribs } from "../dist/html-all-known-attributes.esm.js";

assert.equal(allHtmlAttribs.size, 702);
