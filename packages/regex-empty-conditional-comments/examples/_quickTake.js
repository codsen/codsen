// Quick Take

import { strict as assert } from "assert";

import { emptyCondCommentRegex } from "../dist/regex-empty-conditional-comments.esm.js";

// empty comment which was meant to target Outlook-only
assert.equal(
  emptyCondCommentRegex().test(`<!--[if !mso]>
<![endif]-->`),
  true
);

// empty comment which was meant to target non-Outlook-only
assert.equal(
  emptyCondCommentRegex().test(`<!--[if !mso]><!-- -->
<!--<![endif]-->`),
  true
);

assert.equal(
  emptyCondCommentRegex().test(`<!--[if !mso]><!-- -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->`),
  false
);

assert.equal(
  emptyCondCommentRegex().test(`<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->`),
  false
);

assert.equal(
  emptyCondCommentRegex().exec("<html><!--[if !mso]><![endif]--><title>")[0],
  "<!--[if !mso]><![endif]-->"
);

assert.deepEqual(
  `<html> <!--[if !mso]><![endif]--> <title>text</title> <!--[if gte mso 9]>
<xml>
<![endif]-->`.match(emptyCondCommentRegex()),
  ["<!--[if !mso]><![endif]-->"]
);
