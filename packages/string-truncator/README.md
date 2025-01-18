<h1 align="center">string-truncator</h1>

<p align="center">Over-engineered string truncation for web UI's</p>

<p align="center">
  <a href="https://codsen.com/os/string-truncator" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/string-truncator" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-truncator" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/string-truncator?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-truncator.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/string-truncator/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

```bash
npm i string-truncator
```

## Quick Take

```js
import { strict as assert } from "assert";

import { truncate } from "string-truncator";

// maxLen setting means limit length to equivalent of 10
// longest letter lengths (font "Outfit" letter lengths are used)
// and you can override those references with your font-specific lengths
assert.deepEqual(truncate("Supermotodelicious", { maxLen: 10 }), {
  result: "Supermotodelic",
  addEllipsis: true,
});

assert.deepEqual(
  truncate(
    "the quick brown fox jumps over the lazy dog and then bites him in the tail and runs away",
    {
      maxLen: 10,
      maxLines: 2,
    },
  ),
  {
    result: "the quick brown fox jumps over",
    addEllipsis: true,
  },
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-truncator/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2025 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
