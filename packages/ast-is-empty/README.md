# ast-is-empty

> Find out, is nested array/object/string/AST tree is empty

<div class="package-badges">
  <a href="https://www.npmjs.com/package/ast-is-empty" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/ast-is-empty" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/ast-is-empty" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/ast-is-empty?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/ast-is-empty.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i ast-is-empty
```

## Quick Take

```js
import { strict as assert } from "assert";
import isEmpty from "ast-is-empty";

assert.equal(
  isEmpty({
    a: "",
  }),
  true
);

assert.equal(
  isEmpty({
    a: [""],
    b: {
      c: {
        d: "",
      },
    },
  }),
  true
);

assert.equal(
  isEmpty([
    {
      a: [""],
      b: { c: { d: "" } },
    },
    "",
    ["", "", ""],
  ]),
  true
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/ast-is-empty/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
