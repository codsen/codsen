// Ignore conditional comments that contain markup

import { strict as assert } from "node:assert";

import { emptyCondCommentRegex } from "../dist/regex-empty-conditional-comments.esm.js";

assert.equal(
  emptyCondCommentRegex().test(`<!--[if !mso]><!-- -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->`),
  false,
);

assert.equal(
  emptyCondCommentRegex().test(`<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->`),
  false,
);
