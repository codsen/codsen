// Collect empty conditional comments but skip populated ones

import { strict as assert } from "node:assert";

import { emptyCondCommentRegex } from "../dist/regex-empty-conditional-comments.esm.js";

assert.deepEqual(
  `<html> <!--[if !mso]><![endif]--> <title>text</title> <!--[if gte mso 9]>
<xml>
<![endif]-->`.match(emptyCondCommentRegex()),
  ["<!--[if !mso]><![endif]-->"],
);
