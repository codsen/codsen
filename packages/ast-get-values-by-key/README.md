# ast-get-values-by-key

> Extract values and paths from AST by keys OR set them by keys

<div class="package-badges">
  <a href="https://www.npmjs.com/package/ast-get-values-by-key" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/ast-get-values-by-key" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/ast-get-values-by-key" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/ast-get-values-by-key?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/ast-get-values-by-key.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
  <a href="https://liberamanifesto.com" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/libera-manifesto-lightgrey.svg?style=flat-square" alt="libera manifesto">
  </a>
</div>

## Install

The latest version is **ESM only**: Node 12+ is needed to use it and it must be `import`ed instead of `require`d. If your project is not on ESM yet and you want to use `require`, use an older version of this program, `3.1.0`.

```bash
npm i ast-get-values-by-key
```

## Quick Take

```js
import { strict as assert } from "assert";

import { getByKey } from "ast-get-values-by-key";

// GETTER
// ======

// returns "object-path" notation paths where arrays use dots:
assert.deepEqual(
  getByKey(
    {
      parsed: [
        {
          tag: "html",
        },
      ],
    },
    "tag" // value to search for
  ),
  [{ val: "html", path: "parsed.0.tag" }]
);

// SETTER
// ======

assert.deepEqual(
  getByKey(
    {
      parsed: [
        {
          tag: "html",
        },
      ],
      foo: {
        tag: null,
      },
      bar: {
        tag: null,
      },
    },
    "tag", // value to search for
    [123, 456] // pot of values to pick from (one result not enough)
  ),
  {
    parsed: [
      {
        tag: 123,
      },
    ],
    foo: {
      tag: 456,
    },
    bar: {
      tag: null, // value pot was depleted and there was nothing left to put here
    },
  }
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/ast-get-values-by-key/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2022 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
