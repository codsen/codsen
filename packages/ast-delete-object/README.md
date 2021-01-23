# ast-delete-object

> Delete all plain objects in AST if they contain a certain key/value pair

<div class="package-badges">
  <a href="https://www.npmjs.com/package/ast-delete-object" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/ast-delete-object" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/ast-delete-object" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/ast-delete-object?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/ast-delete-object.svg?style=flat-square" alt="Downloads per month">
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

```bash
npm i ast-delete-object
```

## Quick Take

```js
import { strict as assert } from "assert";
import { deleteObj } from "ast-delete-object";

// if all keys in source object match target object's keys, the
// source object gets deleted:
assert.deepEqual(
  deleteObj(
    [
      "elem1",
      {
        findme1: "zzz",
        findme2: "yyy",
        somethingelse: "qqq",
      },
      "elem2",
    ],
    {
      findme1: "zzz",
      findme2: "yyy",
    }
  ),
  ["elem1", "elem2"]
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/ast-delete-object/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
