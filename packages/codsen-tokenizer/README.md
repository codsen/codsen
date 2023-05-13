<h1 align="center">codsen-tokenizer</h1>

<p align="center">HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages</p>

<p align="center">
  <a href="https://codsen.com/os/codsen-tokenizer" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/codsen-tokenizer" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/codsen-tokenizer" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/codsen-tokenizer?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/codsen-tokenizer.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/codsen-tokenizer/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 5.6.0 (`npm i codsen-tokenizer@5.6.0`).

```bash
npm i codsen-tokenizer
```

## Quick Take

```js
import { strict as assert } from "assert";

import { tokenizer } from "codsen-tokenizer";

const gathered = [];

// it operates from a callback, like Array.prototype.forEach()
tokenizer("<td nowrap>", {
  tagCb: (obj) => {
    gathered.push(obj);
  },
});

assert.deepEqual(gathered, [
  {
    type: "tag",
    start: 0,
    end: 11,
    value: "<td nowrap>",
    tagNameStartsAt: 1,
    tagNameEndsAt: 3,
    tagName: "td",
    recognised: true,
    closing: false,
    void: false,
    pureHTML: true,
    kind: null,
    attribs: [
      {
        attribName: "nowrap",
        attribNameRecognised: true,
        attribNameStartsAt: 4,
        attribNameEndsAt: 10,
        attribOpeningQuoteAt: null,
        attribClosingQuoteAt: null,
        attribValueRaw: null,
        attribValue: [],
        attribValueStartsAt: null,
        attribValueEndsAt: null,
        attribStarts: 4,
        attribEnds: 10,
        attribLeft: 2,
      },
    ],
  },
]);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/codsen-tokenizer/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2023 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
