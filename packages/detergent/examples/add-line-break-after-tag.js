// Insert a line break where a selected HTML tag is stripped

import { strict as assert } from "node:assert";

import { det } from "../dist/detergent.esm.js";

assert.equal(
  det("one<br>two", {
    stripHtml: true,
    stripHtmlButIgnoreTags: [],
    stripHtmlAddNewLine: ["br"],
    replaceLineBreaks: false,
    removeWidows: false,
  }).res,
  "one\ntwo",
);
