// Remove HTML line breaks

import { strict as assert } from "node:assert";

import { crush } from "../dist/html-crush.esm.js";

assert.equal(
  crush("<div>\n  <p>one</p>\n  <p>two</p>\n</div>", {
    removeLineBreaks: true,
  }).result,
  "<div><p>one</p><p>two</p></div>",
);
