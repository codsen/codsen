// Arabic dates

import { strict as assert } from "assert";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";

import c from "../dist/remark-conventional-commit-changelog-timeline.esm.js";

function render(str, opts) {
  let res = unified()
    .data("settings", { fragment: true })
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(c, opts)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .processSync(str);

  return res.value;
}

let input = `
# 0.0.1 (2022-01-01)

### Features

- abc
- xyz
`;

// beware it's right-to-left:
let arabicDate = `
٢٠٢٢/يناير/١
`.trim();

let expected = `
<h2>0.0.1</h2>
<div class="release-date">${arabicDate}</div>
<h3><span class="emoji">✨</span> Features</h3>
<ul>
  <li>abc</li>
  <li>xyz</li>
</ul>
`;

assert.equal(
  render(input, {
    dateDivLocale: "ar-EG",
    dateDivMarkup: ({ year, month, day }) => `${year}/${month}/${day}`,
  }),
  expected
);
