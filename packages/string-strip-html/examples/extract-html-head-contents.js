// Extract HTML `<head>` contents

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

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
const { ranges } = stripHtml(someHtml, {
  onlyStripTags: ["head"],
  stripTogetherWithTheirContents: ["head"],
});
const headRange = ranges?.find(([from, to]) => {
  const candidate = someHtml.slice(from, to);
  return candidate.includes("<head>") && candidate.includes("</head>");
});
const headWithHeadTags = headRange
  ? someHtml.slice(headRange[0], headRange[1]).trim()
  : "";

assert.equal(
  headWithHeadTags,
  `<head>
    <meta charset="utf-8">
    <title>the title</title>
  </head>`,
);

const headContents = headWithHeadTags.replace(/<\/?head>/g, "").trim();
assert.equal(
  headContents,
  `<meta charset="utf-8">
    <title>the title</title>`,
);
