// Remove line indentations

import { strict as assert } from "node:assert";

import { crush } from "../dist/html-crush.esm.js";

const source = "<div>\n    <span>text</span>\n</div>";

assert.equal(crush(source).result, "<div>\n<span>text</span>\n</div>");
assert.equal(
  crush(source, { removeIndentations: false }).result,
  "<div>\n    <span>text</span>\n</div>",
);
