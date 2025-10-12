<h1 align="center">is-char-suitable-for-html-attr-name</h1>

<p align="center">Is given character suitable to be in an HTML attribute's name?</p>

<p align="center">
  <a href="https://codsen.com/os/is-char-suitable-for-html-attr-name" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/is-char-suitable-for-html-attr-name" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/is-char-suitable-for-html-attr-name" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/is-char-suitable-for-html-attr-name?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/is-char-suitable-for-html-attr-name.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/is-char-suitable-for-html-attr-name/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 2.1.0 (`npm i is-char-suitable-for-html-attr-name@2.1.0`).

```bash
npm i is-char-suitable-for-html-attr-name
```

## Quick Take

```js
import { strict as assert } from "assert";

import { isAttrNameChar } from "is-char-suitable-for-html-attr-name";

// Follows the spec:
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2

assert.equal(isAttrNameChar("a"), true);
assert.equal(isAttrNameChar("?"), false);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/is-char-suitable-for-html-attr-name/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright © 2010-2025 Roy Revelt and other contributors

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
