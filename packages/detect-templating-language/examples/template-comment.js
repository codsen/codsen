// A complete template comment provides shared-family evidence

import { strict as assert } from "node:assert";

import { detectLang } from "../dist/detect-templating-language.esm.js";

assert.deepEqual(detectLang("{# reviewer note #}"), { name: "Nunjucks" });
assert.deepEqual(detectLang("{# set ns = namespace() #}"), {
  name: "Nunjucks",
});
assert.deepEqual(detectLang("{# unfinished comment"), { name: null });
