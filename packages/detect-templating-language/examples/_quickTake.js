// Quick Take

import { strict as assert } from "assert";
import { detectLang } from "../dist/detect-templating-language.esm.js";

// detects Nunjucks
assert.deepEqual(
  detectLang(`<div>{% if something %}x{% else %}y{% endif %}</div>`),
  { name: "Nunjucks" }
);

// detects JSP (Java Server Pages)
assert.deepEqual(
  detectLang(
    `<div><c:set var="someList" value="\${jspProp.someList}" /></div>`
  ),
  { name: "JSP" }
);
