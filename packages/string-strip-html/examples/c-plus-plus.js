// Ignores code tags and their contents

import { strict as assert } from "assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

const someHtml = `<code>#include <stdio.h>;</code> and <code>#include &lt;stdio.h&gt;</code>`;

// default behaviour:
assert.equal(stripHtml(someHtml).result, `#include; and #include`);

// ignore <code> tag pairs
assert.equal(
  stripHtml(someHtml, {
    ignoreTagsWithTheirContents: ["code"],
    skipHtmlDecoding: true,
  }).result,
  someHtml
);
