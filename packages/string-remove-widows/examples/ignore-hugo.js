// Ignore Hugo template expressions while processing surrounding text

import { strict as assert } from "node:assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

assert.equal(
  removeWidows("Some text {{ .Title }}\n\nmore text and more text.", {
    ignore: "hugo",
    minCharCount: 5,
  }).res,
  "Some text {{ .Title }}\n\nmore text and more&nbsp;text.",
);
