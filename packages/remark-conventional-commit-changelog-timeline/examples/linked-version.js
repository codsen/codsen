// Convert a linked release heading into timeline markup

import { strict as assert } from "node:assert";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import timeline from "../dist/remark-conventional-commit-changelog-timeline.esm.js";

const result = unified()
  .data("settings", { fragment: true })
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(timeline)
  .use(rehypeFormat)
  .use(rehypeStringify)
  .processSync(
    "# [2.0.0](https://example.com/releases/2.0.0) (2024-03-05)\n",
  ).value;

assert.equal(
  result,
  `
<h2>2.0.0</h2>
<div class="release-date">Mar 5, <span>2024</span></div>
`,
);
