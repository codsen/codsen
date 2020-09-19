/* eslint import/extensions:0 */

// Remove all HTML from a string

import { strict as assert } from "assert";
import stripHtml from "../dist/string-strip-html.esm.js";

const someHtml = `<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <h1>Title</h1>
    Some text.
  </body>
</html>`;

assert.equal(stripHtml(someHtml).result, `Title\nSome text.`);
