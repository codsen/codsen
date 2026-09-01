// Ignore every built-in template syntax preset

import { strict as assert } from "node:assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

assert.equal(
  removeWidows(
    "Some {{ value }} and <%= page.title %>\n\nmore text and more text.",
    { ignore: "all", minCharCount: 5 },
  ).res,
  "Some {{ value }}&nbsp;and <%= page.title %>\n\nmore text and more&nbsp;text.",
);
