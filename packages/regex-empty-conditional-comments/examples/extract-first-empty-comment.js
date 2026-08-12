// Extract the first empty conditional comment

import { strict as assert } from "node:assert";

import { emptyCondCommentRegex } from "../dist/regex-empty-conditional-comments.esm.js";

assert.equal(
  emptyCondCommentRegex().exec("<html><!--[if !mso]><![endif]--><title>")[0],
  "<!--[if !mso]><![endif]-->",
);
