// Reject HTML without JSP syntax

import { strict as assert } from "node:assert";

import { isJSP } from "../dist/regex-is-jsp.esm.js";

assert.equal(isJSP().test("<div>Plain text</div>"), false);
