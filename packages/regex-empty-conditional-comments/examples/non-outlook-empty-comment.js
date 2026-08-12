// Match the revealed form of an empty conditional comment

import { strict as assert } from "node:assert";

import { emptyCondCommentRegex } from "../dist/regex-empty-conditional-comments.esm.js";

assert.equal(
  emptyCondCommentRegex().test(`<!--[if !mso]><!-- -->
<!--<![endif]-->`),
  true,
);
