<h1 align="center">json-variables</h1>

<p align="center">Resolves custom-marked, cross-referenced paths in parsed JSON</p>

<p align="center">
  <a href="https://codsen.com/os/json-variables" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/json-variables" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/json-variables" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/json-variables?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/json-variables.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/json-variables/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 10.1.0 (`npm i json-variables@10.1.0`).

```bash
npm i json-variables
```

## Quick Take

```js
import { strict as assert } from "assert";

import { jVar } from "json-variables";

assert.deepEqual(
  jVar({
    a: "some text %%_var1.key1.0_%% more text %%_var2.key2.key3.1_%%",
    b: "something",
    var1: { key1: ["value1"] },
    var2: { key2: { key3: ["", "value2"] } },
  }),
  {
    a: "some text value1 more text value2",
    b: "something",
    var1: { key1: ["value1"] },
    var2: { key2: { key3: ["", "value2"] } },
  },
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/json-variables/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2025 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
