// Quick Take

import { strict as assert } from "assert";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";

import c from "../dist/remark-conventional-commit-changelog-timeline.esm.js";

function render(str) {
  let res = unified()
    .data("settings", { fragment: true })
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(c)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .processSync(str);

  return res.value;
}

let input = `
# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.1.0 (2022-08-12)

### Features

- abc
- xyz
`;

let expected = `
<h2>3.1.0</h2>
<div class="release-date">12 Aug<br>2022</div>
<h3><span class="emoji">✨</span> Features</h3>
<ul>
  <li>abc</li>
  <li>xyz</li>
</ul>
`;

assert.equal(render(input), expected);
