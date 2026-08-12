// Quick Take

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

assert.equal(
  stripHtml("Some text <b>and</b> text.").result,
  "Some text and text.",
);
