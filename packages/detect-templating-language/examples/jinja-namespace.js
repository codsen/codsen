// Detect Jinja namespace syntax

import { strict as assert } from "node:assert";

import { detectLang } from "../dist/detect-templating-language.esm.js";

assert.deepEqual(detectLang("{% set ns = namespace(total=0) %}"), {
  name: "Jinja",
});
