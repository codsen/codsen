// Preserve custom elements while stripping recognised HTML tags

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

assert.equal(
  stripHtml("<div><custom>hello</custom></div>", {
    stripRecognisedHTMLOnly: true,
  }).result,
  "<custom>hello</custom>",
);
