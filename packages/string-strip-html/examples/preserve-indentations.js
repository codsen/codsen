// Preserve indentation while collapsing whitespace around stripped tags

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

assert.equal(
  stripHtml("  one <b>two</b>\n    three <i>four</i>", {
    ignoreIndentations: true,
  }).result,
  "  one two\n    three four",
);
