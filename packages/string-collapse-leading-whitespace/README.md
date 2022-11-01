<h1 align="center">string-collapse-leading-whitespace</h1>

<p align="center">Collapse the leading and trailing whitespace of a string</p>

<p align="center">
  <a href="https://codsen.com/os/string-collapse-leading-whitespace" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/string-collapse-leading-whitespace" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-collapse-leading-whitespace" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/string-collapse-leading-whitespace?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-collapse-leading-whitespace.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/string-collapse-leading-whitespace/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 5.1.0 (`npm i string-collapse-leading-whitespace@5.1.0`).

```bash
npm i string-collapse-leading-whitespace
```

## Quick Take

```js
import { strict as assert } from "assert";

import { collWhitespace } from "string-collapse-leading-whitespace";

// if leading/trailing whitespace doesn't contain \n, collapse to a single space
assert.equal(collWhitespace("  aaa   "), " aaa ");

// otherwise, collapse to a single \n (default setting)
assert.equal(collWhitespace("     \n\n   aaa  \n\n\n    "), "\naaa\n");

// does nothing to trimmed strings:
assert.equal(collWhitespace("aaa"), "aaa");

// if there are multiple lines string is still processed in trim-fashion -
// only beginning and ending whitespace is changed:
assert.equal(
  collWhitespace("  abc  \n  def  \n  ghi  "),
  " abc  \n  def  \n  ghi "
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-collapse-leading-whitespace/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2022 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
