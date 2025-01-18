<h1 align="center">codsen-parser</h1>

<p align="center">Parser aiming at broken or mixed code, especially HTML & CSS</p>

<p align="center">
  <a href="https://codsen.com/os/codsen-parser" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/codsen-parser" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/codsen-parser" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/codsen-parser?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/codsen-parser.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/codsen-parser/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

```bash
npm i codsen-parser
```

## Quick Take

```js
import { strict as assert } from "assert";

import { cparser } from "codsen-parser";

assert.deepEqual(cparser("<br>z</a>"), [
  {
    type: "tag",
    kind: "inline",
    tagName: "br",
    tagNameStartsAt: 1,
    tagNameEndsAt: 3,
    closing: false,
    void: true,
    pureHTML: true,
    recognised: true,
    start: 0,
    end: 4,
    value: "<br>",
    attribs: [],
    children: [],
  },
  {
    type: "text",
    start: 4,
    end: 5,
    value: "z",
  },
  {
    type: "tag",
    kind: "inline",
    tagName: "a",
    tagNameStartsAt: 7,
    tagNameEndsAt: 8,
    closing: true,
    void: false,
    pureHTML: true,
    recognised: true,
    start: 5,
    end: 9,
    value: "</a>",
    attribs: [],
    children: [],
  },
]);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/codsen-parser/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2025 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
