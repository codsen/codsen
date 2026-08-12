/** biome-ignore-all lint/suspicious/noTemplateCurlyInString: fixture contains literal JSP expression syntax */

// Detect a JSP Standard Tag Library tag

import { strict as assert } from "node:assert";

import { isJSP } from "../dist/regex-is-jsp.esm.js";

assert.equal(isJSP().test('<c:if test="${enabled}">Visible</c:if>'), true);
