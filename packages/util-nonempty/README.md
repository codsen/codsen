<h1 align="center">util-nonempty</h1>

<p align="center">Is the input (plain object, array, string or whatever) not empty?</p>

<p align="center">
  <a href="https://codsen.com/os/util-nonempty" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/util-nonempty" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/util-nonempty" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/util-nonempty?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/util-nonempty.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/util-nonempty/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 3.1.0 (`npm i util-nonempty@3.1.0`).

```bash
npm i util-nonempty
```

## Quick Take

```js
import { strict as assert } from "assert";

import { nonEmpty } from "util-nonempty";

assert.equal(nonEmpty("z"), true);
assert.equal(nonEmpty(""), false);
assert.equal(nonEmpty(["a"]), true);
assert.equal(nonEmpty([123]), true);
assert.equal(nonEmpty([[[[[[[[[[[]]]]]]]]]]]), true);
assert.equal(nonEmpty({ a: "" }), true);
assert.equal(nonEmpty({ a: "a" }), true);
assert.equal(nonEmpty({}), false);

const f = () => {
  return "z";
};
assert.equal(nonEmpty(f), false);
// (answer is instantly false if input is not array, plain object or string)
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/util-nonempty/) for a full description of the API. If you’re looking for the **Changelog**, it’s [here](https://github.com/codsen/codsen/blob/main/packages/util-nonempty/CHANGELOG.md).

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright © 2010-2025 Roy Revelt and other contributors

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
