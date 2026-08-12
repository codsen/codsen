/** biome-ignore-all lint/suspicious/noTemplateCurlyInString: fixture contains literal JSP expression syntax */

// Detect Java Server Pages using a JSP Standard Tag Library element

import { strict as assert } from "node:assert";

import { detectLang } from "../dist/detect-templating-language.esm.js";

assert.deepEqual(
  detectLang('<div><c:set var="someList" value="${jspProp.someList}" /></div>'),
  { name: "JSP" },
);
