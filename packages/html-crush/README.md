<h1 align="center">html-crush</h1>

<p align="center">Minify email templates</p>

<p align="center">
  <a href="https://codsen.com/os/html-crush" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/html-crush" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/html-crush" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/html-crush?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/html-crush.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/html-crush/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
  <a href="https://codsen.com/os/html-crush/play"><img src="https://img.shields.io/badge/playground-here-brightgreen?style=flat-square" alt="playground"></a>
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 4.2.0 (`npm i html-crush@4.2.0`).

```bash
npm i html-crush
```

## Quick Take

```js
import { strict as assert } from "assert";

import { crush, defaults, version } from "html-crush";

assert.equal(
  crush(
    `<table width="100" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td>
      hi
    </td>
  </tr>
</table>`,
    { removeLineBreaks: true },
  ).result,
  `<table width="100" border="0" cellpadding="0" cellspacing="0"><tr><td> hi
</td></tr></table>`,
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/html-crush/) for a full description of the API. Also, try the [GUI playground](https://codsen.com/os/html-crush/play).

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2025 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
