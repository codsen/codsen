// Remove empty conditional comments

import { strict as assert } from "node:assert";

import { emptyCondCommentRegex } from "../dist/regex-empty-conditional-comments.esm.js";

const html = "<head><!--[if !mso]><![endif]--><title>Example</title></head>";

assert.equal(
  html.replace(emptyCondCommentRegex(), ""),
  "<head><title>Example</title></head>",
);
