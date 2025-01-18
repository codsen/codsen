<h1 align="center">string-find-heads-tails</h1>

<p align="center">Finds where are arbitrary templating marker heads and tails located</p>

<p align="center">
  <a href="https://codsen.com/os/string-find-heads-tails" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/string-find-heads-tails" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-find-heads-tails" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/string-find-heads-tails?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-find-heads-tails.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/string-find-heads-tails/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 4.1.0 (`npm i string-find-heads-tails@4.1.0`).

```bash
npm i string-find-heads-tails
```

## Quick Take

```js
import { strict as assert } from "assert";

import { strFindHeadsTails } from "string-find-heads-tails";

// processing an arbitrary, custom templating markup:
assert.deepEqual(
  strFindHeadsTails(
    "some text %%_var1-%% more text %%_var2_%%",
    ["%%_", "%%-"], // two flavours of heads
    ["-%%", "_%%"], // two flavours of tails
  ),
  [
    {
      headsStartAt: 10,
      headsEndAt: 13,
      tailsStartAt: 17,
      tailsEndAt: 20,
    },
    {
      headsStartAt: 31,
      headsEndAt: 34,
      tailsStartAt: 38,
      tailsEndAt: 41,
    },
  ],
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-find-heads-tails/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2025 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
