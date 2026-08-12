// Keep selected tags while stripping the rest

import { strict as assert } from "node:assert";

import { det } from "../dist/detergent.esm.js";

assert.equal(
  det("Before <div><mark>inside</mark></div> after", {
    stripHtml: true,
    stripHtmlButIgnoreTags: ["mark"],
    removeWidows: false,
  }).res,
  "Before <mark>inside</mark> after",
);
