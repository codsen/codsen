# json-variables

> Resolves custom-marked, cross-referenced paths in parsed JSON

<div class="package-badges">
  <a href="https://www.npmjs.com/package/json-variables" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/json-variables" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/json-variables" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/json-variables?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/json-variables.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i json-variables
```

## Quick Take

```js
import { strict as assert } from "assert";
import jVar from "json-variables";

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
  }
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/json-variables/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
