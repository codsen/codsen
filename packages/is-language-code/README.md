<h1 align="center">is-language-code</h1>

<p align="center">Is given string a language code (as per IANA)</p>

<p align="center">
  <a href="https://codsen.com/os/is-language-code" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/is-language-code" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/is-language-code" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/is-language-code?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/is-language-code.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/is-language-code/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
  <a href="https://codsen.com/os/is-language-code/play"><img src="https://img.shields.io/badge/playground-here-brightgreen?style=flat-square" alt="playground"></a>
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 3.1.0 (`npm i is-language-code@3.1.0`).

```bash
npm i is-language-code
```

## Quick Take

```js
import { strict as assert } from "assert";

import { isLangCode } from "is-language-code";

assert.deepEqual(isLangCode("de-419-DE"), {
  res: false,
  message: 'Two region subtags, "419" and "de".',
});

assert.deepEqual(isLangCode("sr-Latn"), {
  res: true,
  message: null,
});
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/is-language-code/) for a full description of the API. Also, try the [GUI playground](https://codsen.com/os/is-language-code/play).

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2024 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
