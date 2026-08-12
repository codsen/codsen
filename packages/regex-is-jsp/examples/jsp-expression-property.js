/** biome-ignore-all lint/suspicious/noTemplateCurlyInString: fixture contains literal JSP expression syntax */

// Detect an expression that refers to a JSP property

import { strict as assert } from "node:assert";

import { isJSP } from "../dist/regex-is-jsp.esm.js";

assert.equal(isJSP().test("${jspProp.accountNumber}"), true);
