// Preserve punctuation around removed inline tags

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

assert.equal(
  stripHtml("Hello <b>world</b>, welcome!").result,
  "Hello world, welcome!",
);
