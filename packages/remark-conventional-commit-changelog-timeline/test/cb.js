import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

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

// ---------------------------------------------------------

test("01", () => {
  let input = `
# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 1.0.0 (2020-09-02)

### Features

- abc
- xyz
`;

  let expected = `
<h2>1.0.0</h2>
<div class="release-date">2 Sept<br class="z">2020</div>
<h3><span class="emoji">✨</span> Features</h3>
<ul>
  <li>abc</li>
  <li>xyz</li>
</ul>
`;

  equal(
    render(input, {
      dateDivLocale: "en-UK",
      dateDivMarkup: ({ year, month, day }) =>
        `${day} ${month}<br class="z">${year}`,
    }),
    expected,
    "01.01"
  );
});

test("02 - static string in the date callback", () => {
  let input = `
# 0.0.1 (2022-01-01)

### Features

- abc
- xyz
`;

  let expected = `
<h2>0.0.1</h2>
<div class="release-date">foo</div>
<h3><span class="emoji">✨</span> Features</h3>
<ul>
  <li>abc</li>
  <li>xyz</li>
</ul>
`;

  equal(
    render(input, {
      dateDivLocale: "en-UK",
      dateDivMarkup: () => "foo",
    }),
    expected,
    "02.01"
  );
});

test("03 - arabic dates", () => {
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

  equal(
    render(input, {
      dateDivLocale: "ar-EG",
      dateDivMarkup: ({ date, year, month, day }) => {
        equal(date instanceof Date, true);
        equal(year, "٢٠٢٢");
        equal(month, "يناير");
        equal(day, "١");
        return `${year}/${month}/${day}`;
      },
    }),
    expected,
    "03.01"
  );
});

test.run();
