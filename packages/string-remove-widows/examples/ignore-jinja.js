// Ignore Jinja tags while processing surrounding text

import { strict as assert } from "node:assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

assert.equal(
  removeWidows(
    "Some text {% if enabled %}fancy{% endif %}\n\nmore text and more text.",
    { ignore: "jinja", minCharCount: 5 },
  ).res,
  "Some text {% if enabled %}fancy{% endif %}\n\nmore text and more&nbsp;text.",
);
