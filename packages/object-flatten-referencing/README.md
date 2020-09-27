# object-flatten-referencing

> Flatten complex nested objects according to a reference objects

<div class="package-badges">
  <a href="https://www.npmjs.com/package/object-flatten-referencing" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/object-flatten-referencing" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/object-flatten-referencing" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/object-flatten-referencing?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/object-flatten-referencing.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i object-flatten-referencing
```

## Quick Take

```js
import { strict as assert } from "assert";
import ofr from "object-flatten-referencing";

assert.deepEqual(
  ofr(
    {
      key1: "val11.val12",
      key2: "val21.val22",
    },
    {
      key1: "Contact us",
      key2: "Tel. 0123456789",
    }
  ),
  {
    key1: "%%_val11.val12_%%",
    key2: "%%_val21.val22_%%",
  }
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/object-flatten-referencing/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
