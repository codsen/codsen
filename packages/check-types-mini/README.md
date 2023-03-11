<h1 align="center">check-types-mini</h1>

<p align="center">Validate options object</p>

<p align="center">
  <a href="https://codsen.com/os/check-types-mini" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/check-types-mini" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/check-types-mini" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/check-types-mini?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/check-types-mini.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/check-types-mini/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 6.1.0 (`npm i check-types-mini@6.1.0`).

```bash
npm i check-types-mini
```

## Quick Take

```js
import { strict as assert } from "assert";

import { checkTypesMini } from "check-types-mini";

assert.throws(
  () => {
    checkTypesMini(
      {
        // object to check
        option1: "setting1",
        option2: "false",
        option3: false,
      },
      {
        // reference defaults object
        option1: "setting1",
        option2: false,
        option3: false,
      }
    );
  },
  (err) => {
    assert(/not boolean but string/.test(err));
    return true;
  }
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/check-types-mini/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2023 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
