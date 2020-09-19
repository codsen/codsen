/* eslint import/extensions:0 */

// Leave only HTML

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

assert.equal(
  stripHtml(someHtml).allTagLocations.reduce(
    (acc, [from, to]) => `${acc}${someHtml.slice(from, to)}`,
    ""
  ),
  `<!DOCTYPE html><html lang="en" dir="ltr"><head><meta charset="utf-8"><title></title></head><body><h1></h1></body></html>`
);
