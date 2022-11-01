<h1 align="center">ranges-ent-decode</h1>

<p align="center">Recursive HTML entity decoding for Ranges workflow</p>

<p align="center">
  <a href="https://codsen.com/os/ranges-ent-decode" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/ranges-ent-decode" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/ranges-ent-decode" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/ranges-ent-decode?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/ranges-ent-decode.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/ranges-ent-decode/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 4.1.0 (`npm i ranges-ent-decode@4.1.0`).

```bash
npm i ranges-ent-decode
```

## Quick Take

```js
import { strict as assert } from "assert";

import { rEntDecode } from "ranges-ent-decode";

// see codsen.com/ranges/
assert.deepEqual(rEntDecode("a &#x26; b &amp; c"), [
  [2, 8, "&"], // <--- that's Ranges notation, instructing to replace
  [11, 16, "&"],
]);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/ranges-ent-decode/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2022 Roy Revelt and other contributors.

Some tests and some regexes adapted from he.js
MIT Licence - Copyright © 2013-2018 Mathias Bynens <https://mathiasbynens.be/>
https://github.com/mathiasbynens/he

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
