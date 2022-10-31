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

//

test(`01 - h1 version without a link`, () => {
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
<div class="release-date">Aug 12, <span>2022</span></div>
<h3><span class="emoji">✨</span> Features</h3>
<ul>
  <li>abc</li>
  <li>xyz</li>
</ul>
`;

  equal(render(input), expected, "01.01");
});

test(`02 - mix`, () => {
  let input = `# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.4.0](https://github.com/codsen/codsen/compare/remark-conventional-commit-changelog-timeline@0.3.4...remark-conventional-commit-changelog-timeline@0.4.0) (2022-10-13)

### Features

- correct apostrophes after code tag pairs ([6495fe3](https://github.com/codsen/codsen/commit/6495fe370022eca5ad984b689294cdee33db1a63))

## [0.3.0](https://github.com/codsen/codsen/compare/remark-conventional-commit-changelog-timeline@0.2.0...remark-conventional-commit-changelog-timeline@0.3.0) (2022-09-27)

### Bug Fixes

- fix dependencies ([c945828](https://github.com/codsen/codsen/commit/c945828389167e9e304b29dd6b3a5ad4e5551f9e))

### BREAKING CHANGES

- fix dependencies

## 1.0.0 (2022-09-25)

- promote semver to stable v1
- move few TS-exclusive dependencies from "devDependencies" to "dependencies" because types are still importing them and so they are not "dev"
`;

  let expected = `
<h2>0.4.0</h2>
<div class="release-date">13 Oct <span>2022</span></div>
<h3><span class="emoji">✨</span> Features</h3>
<ul>
  <li>correct apostrophes after code tag pairs (<a href="https://github.com/codsen/codsen/commit/6495fe370022eca5ad984b689294cdee33db1a63">6495fe3</a>)</li>
</ul>
<h2>0.3.0</h2>
<div class="release-date">27 Sept <span>2022</span></div>
<h3><span class="emoji">🔧</span> Fixed</h3>
<ul>
  <li>fix dependencies (<a href="https://github.com/codsen/codsen/commit/c945828389167e9e304b29dd6b3a5ad4e5551f9e">c945828</a>)</li>
</ul>
<h3><span class="emoji">💥</span> BREAKING CHANGES</h3>
<ul>
  <li>fix dependencies</li>
</ul>
<h2>1.0.0</h2>
<div class="release-date">25 Sept <span>2022</span></div>
<ul>
  <li>promote semver to stable v1</li>
  <li>move few TS-exclusive dependencies from "devDependencies" to "dependencies" because types are still importing them and so they are not "dev"</li>
</ul>
`;

  equal(
    render(input, {
      dateDivLocale: "en-UK",
      dateDivMarkup: ({ year, month, day }) =>
        `${day} ${month} <span>${year}</span>`,
    }),
    expected,
    "02.01"
  );
});

test(`03 - other h2 without version`, () => {
  let input = `
# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## Whatever

### Features

- abc
- xyz
`;

  let expected = `
<h2>Whatever</h2>
<h3><span class="emoji">✨</span> Features</h3>
<ul>
  <li>abc</li>
  <li>xyz</li>
</ul>
`;

  equal(render(input), expected, "03.01");
});

test.run();
