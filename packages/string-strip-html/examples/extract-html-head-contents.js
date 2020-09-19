/* eslint import/extensions:0 */

// Extract HTML head contents

import { strict as assert } from "assert";
import stripHtml from "../dist/string-strip-html.esm.js";

const someHtml = `<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>the title</title>
  </head>
  <body>
    the content
  </body>
</html>`;

// The task asks not to include <head...> and </head>.
// First, extract head tag-to-head tag, including contents
const headWithHeadTags = stripHtml(someHtml, {
  onlyStripTags: ["head"],
  stripTogetherWithTheirContents: ["head"],
})
  .filteredTagLocations.reduce(
    (acc, [from, to]) => `${acc}${someHtml.slice(from, to)}`,
    ""
  )
  .trim();

assert.equal(
  headWithHeadTags,
  `<head>
    <meta charset="utf-8">
    <title>the title</title>
  </head>`
);

const headContents = headWithHeadTags.replace(/<\/?head>/g, "").trim();
assert.equal(
  headContents,
  `<meta charset="utf-8">
    <title>the title</title>`
);
