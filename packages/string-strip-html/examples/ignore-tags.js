// Preserve selected tags while stripping the rest

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

assert.equal(
  stripHtml("<div>Read <b>this</b></div>", { ignoreTags: ["b"] }).result,
  "Read <b>this</b>",
);
