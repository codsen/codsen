<h1 align="center">js-row-num</h1>

<p align="center">Update all row numbers in all console.logs in JS code</p>

<p align="center">
  <a href="https://codsen.com/os/js-row-num" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/js-row-num" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/js-row-num" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/js-row-num?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/js-row-num.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/js-row-num/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 4.1.0 (`npm i js-row-num@4.1.0`).

```bash
npm i js-row-num
```

## Quick Take

```js
import { strict as assert } from "assert";

import { fixRowNums } from "js-row-num";

// sets line number to 002 because it's on row number two
assert.equal(
  fixRowNums(`const foo = "bar";\n console.log(\`0 foo = \${foo}\`)`),
  `const foo = "bar";\n console.log(\`002 foo = \${foo}\`)`
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/js-row-num/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2022 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
