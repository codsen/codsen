// Ignore Hexo template expressions while processing surrounding text

import { strict as assert } from "node:assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

assert.equal(
  removeWidows("Some text <%= page.title %>\n\nmore text and more text.", {
    ignore: "hexo",
    minCharCount: 5,
  }).res,
  "Some text <%= page.title %>\n\nmore text and more&nbsp;text.",
);
