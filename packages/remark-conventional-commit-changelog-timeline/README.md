<h1 align="center">remark-conventional-commit-changelog-timeline</h1>

<p align="center">Remark plugin to process Conventional Commits changelogs to be displayed in a timeline.</p>

<p align="center">
  <a href="https://codsen.com/os/remark-conventional-commit-changelog-timeline" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/remark-conventional-commit-changelog-timeline" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/remark-conventional-commit-changelog-timeline" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/remark-conventional-commit-changelog-timeline?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/remark-conventional-commit-changelog-timeline.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/remark-conventional-commit-changelog-timeline/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is not pure ESM, you can `require` it.

```bash
npm i remark-conventional-commit-changelog-timeline
```

## Quick Take

```js
import { strict as assert } from "assert";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";

import c from "remark-conventional-commit-changelog-timeline";

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

assert.equal(
  render(input, {
    // defaults:
    dateDivLocale: "en-US",

    dateDivMarkup: ({ date, year, month, day }) =>
      `${month} ${day}, <span>${year}</span>`,
  }),
  expected,
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/remark-conventional-commit-changelog-timeline/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2025 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
