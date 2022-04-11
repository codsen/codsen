# ast-monkey-traverse

> Utility library to traverse AST

<div class="package-badges">
  <a href="https://www.npmjs.com/package/ast-monkey-traverse" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/ast-monkey-traverse" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/ast-monkey-traverse" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/ast-monkey-traverse?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/ast-monkey-traverse.svg?style=flat-square" alt="Downloads per month">
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

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 2.1.0 (`npm i ast-monkey-traverse@2.1.0`).

```bash
npm i ast-monkey-traverse
```

## Quick Take

```js
import { strict as assert } from "assert";

import { traverse } from "ast-monkey-traverse";

const paths = [];
const source = {
  a: {
    foo: {
      bar: [
        {
          foo: "c",
        },
      ],
      d: {
        e: {
          foo: "f",
        },
      },
    },
  },
};

traverse(source, (key, val, innerObj) => {
  // if currently an object is traversed, you get both "key" and "val"
  // if it's array, only "key" is present, "val" is undefined
  let current = val !== undefined ? val : key;
  if (
    // it's object (not array)
    val !== undefined &&
    // and has the key we need
    key === "foo"
  ) {
    // push the path to array in the outer scope
    paths.push(innerObj.path);
  }
  return current;
});

// notice object-path notation "a.foo.bar.0.foo" - array segments use dots too:
assert.deepEqual(paths, ["a.foo", "a.foo.bar.0.foo", "a.foo.d.e.foo"]);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/ast-monkey-traverse/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2022 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
