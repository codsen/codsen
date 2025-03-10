<h1 align="center">is-html-attribute-closing</h1>

<p align="center">Is a character on a given index a closing of an HTML attribute?</p>

<p align="center">
  <a href="https://codsen.com/os/is-html-attribute-closing" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/is-html-attribute-closing" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/is-html-attribute-closing" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/is-html-attribute-closing?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/is-html-attribute-closing.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/is-html-attribute-closing/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 2.3.0 (`npm i is-html-attribute-closing@2.3.0`).

```bash
npm i is-html-attribute-closing
```

## Quick Take

```js
import { strict as assert } from "assert";

import { isAttrClosing } from "is-html-attribute-closing";

const str = '<a href="zzz" target="_blank" style="color: black;">';

// <a href="zzz" target="_blank" ...
//                      ^
//                  index 21

// <a href="zzz" target="_blank" ...
//                             ^
//                         index 28

assert.equal(
  isAttrClosing(
    str, // reference string
    21, // known opening (or in absence of a quote, a start of a value)
    28, // we ask, is this a closing on the attribute?
  ),
  true, // the answer
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/is-html-attribute-closing/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2025 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
