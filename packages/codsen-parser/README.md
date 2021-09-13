# codsen-parser

> Parser aiming at broken or mixed code, especially HTML & CSS

<div class="package-badges">
  <a href="https://www.npmjs.com/package/codsen-parser" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/codsen-parser" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/codsen-parser" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/codsen-parser?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/codsen-parser.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
  <a href="https://liberamanifesto.com" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/libera-manifesto-lightgrey.svg?style=flat-square" alt="libera manifesto">
  </a>
</div>

## Install

This package is ESM only: Node 12+ is needed to use it and it must be imported instead of required:

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

Please [visit codsen.com](https://codsen.com/os/codsen-parser/) for a full description of the API and examples.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
