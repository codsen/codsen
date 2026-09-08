// Recognize JSP standard actions through a renamed XML namespace prefix

import { strict as assert } from "node:assert";

import { detectLang } from "../dist/detect-templating-language.esm.js";

assert.deepEqual(
  detectLang(
    '<html xmlns:j="http://java.sun.com/JSP/Page"><j:text>Hello</j:text></html>',
  ),
  { name: "JSP" },
);

assert.deepEqual(detectLang('<c:chart xmlns:c="urn:example:charts"/>'), {
  name: null,
});
