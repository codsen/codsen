<h1 align="center">ast-monkey</h1>

<p align="center">Traverse and edit AST</p>

<p align="center">
  <a href="https://codsen.com/os/ast-monkey" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/ast-monkey" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/ast-monkey" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/ast-monkey?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/ast-monkey.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/ast-monkey/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

**No 3rd party dependencies.** All dependencies, checked recursively, are Codsen packages.

## Features

Transform and inspect nested arrays and objects with two traversal contracts and higher-level helpers.

- Use `traverse` and `DELETE` from `ast-monkey/traverse` to transform a cloned tree, replace values, or remove entries.
- Use `traverseWithLookahead` from `ast-monkey/lookahead` to observe visits and preview upcoming nodes. Its callback return is ignored, and callback values can reference the original input.
- Import all APIs, including `find`, `get`, `set`, `drop`, `del`, and `arrayFirstOnly`, from `ast-monkey`.
- The traversal subpaths load smaller JavaScript entry points. They share the package installation and its dependencies.
- Direct browser scripts keep `dist/ast-monkey.umd.js` and the `astMonkey` global, including both traversal APIs.

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 7.15.0 (`npm i ast-monkey@7.15.0`).

```bash
npm i ast-monkey
```

## Quick Take

```js
import { strict as assert } from "node:assert";

import { find } from "ast-monkey";

assert.deepEqual(
  find(
    {
      a1: {
        b1: "c1",
      },
      a2: {
        b2: "c2",
      },
      z1: {
        x1: "y1",
      },
    },
    { key: "a*" },
  ),
  [
    {
      index: 1,
      key: "a1",
      val: {
        b1: "c1",
      },
      path: [1],
    },
    {
      index: 3,
      key: "a2",
      val: {
        b2: "c2",
      },
      path: [3],
    },
  ],
);
```


## Documentation

Please [visit codsen.com](https://codsen.com/os/ast-monkey/) for a full description of the API. For **Changelog**, see [raw md on GitHub](https://github.com/codsen/codsen/blob/main/packages/ast-monkey/CHANGELOG.md) or [the website](https://codsen.com/os/ast-monkey/changelog).

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright © 2010-2026 Roy Revelt and other contributors

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
