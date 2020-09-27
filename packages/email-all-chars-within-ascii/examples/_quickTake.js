/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import within from "../dist/email-all-chars-within-ascii.esm.js";

// that emoji should have been HTML-encoded (using Detergent.io for example)
assert.throws(() => {
  within(`<!DOCTYPE html>
  <html lang="en" dir="ltr">
    <head>
      <meta charset="utf-8">
      <title></title>
    </head>
    <body>
      🧢
    </body>
  </html>`);
});
