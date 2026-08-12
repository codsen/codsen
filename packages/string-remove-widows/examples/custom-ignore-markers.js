// Ignore a custom pair of template markers

import { strict as assert } from "node:assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

assert.equal(
  removeWidows(
    "Some text [[ do not change this ]]\n\nmore text and more text.",
    {
      ignore: [{ heads: "[[", tails: "]]" }],
      minCharCount: 5,
    },
  ).res,
  "Some text [[ do not change this ]]\n\nmore text and more&nbsp;text.",
);
