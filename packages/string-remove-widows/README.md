<h1 align="center">string-remove-widows</h1>

<p align="center">Helps to prevent widow words in a text</p>

<p align="center">
  <a href="https://codsen.com/os/string-remove-widows" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/string-remove-widows" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-remove-widows" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/string-remove-widows?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-remove-widows.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/string-remove-widows/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 2.1.0 (`npm i string-remove-widows@2.1.0`).

```bash
npm i string-remove-widows
```

## Quick Take

```js
import { strict as assert } from "assert";

import { removeWidows } from "string-remove-widows";

const { ranges, res } = removeWidows("Some text with many words on one line.");

// see codsen.com/ranges/
assert.deepEqual(ranges, [[32, 33, "&nbsp;"]]);

assert.equal(res, "Some text with many words on one&nbsp;line.");
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-remove-widows/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2022 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
