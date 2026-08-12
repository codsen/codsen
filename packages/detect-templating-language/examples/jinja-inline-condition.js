// Detect a Jinja inline conditional expression

import { strict as assert } from "node:assert";

import { detectLang } from "../dist/detect-templating-language.esm.js";

assert.deepEqual(detectLang("{{'open' if enabled else 'closed'}}"), {
  name: "Jinja",
});
