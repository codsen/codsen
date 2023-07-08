<h1 align="center">object-all-values-equal-to</h1>

<p align="center">Does the AST/nested-plain-object/array/whatever contain only one kind of value?</p>

<p align="center">
  <a href="https://codsen.com/os/object-all-values-equal-to" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/object-all-values-equal-to" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/object-all-values-equal-to" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/object-all-values-equal-to?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/object-all-values-equal-to.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/object-all-values-equal-to/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 2.1.0 (`npm i object-all-values-equal-to@2.1.0`).

```bash
npm i object-all-values-equal-to
```

## Quick Take

```js
import { strict as assert } from "assert";

import { allEq } from "object-all-values-equal-to";

// are all values equal to null:
assert.equal(allEq({ a: null, c: null }, null), true);
// yes

// are all values equal to "false":
assert.equal(allEq({ a: false, c: "zzz" }, false), false);
// no

// are all values equal to "false"?
assert.equal(
  allEq(
    {
      a: {
        b: false,
        c: [
          {
            d: false,
            e: false,
          },
          {
            g: false,
          },
        ],
      },
      c: false,
    },
    false, // reference value to check
  ),
  true, // answer is, yes
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/object-all-values-equal-to/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2023 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
