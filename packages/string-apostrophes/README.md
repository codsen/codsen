# string-apostrophes

> Comprehensive, HTML-entities-aware tool to typographically-correct the apostrophes and single/double quotes

<div class="package-badges">
  <a href="https://www.npmjs.com/package/string-apostrophes" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/string-apostrophes" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/string-apostrophes" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/string-apostrophes?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-apostrophes.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i string-apostrophes
```

## Quick Take

```js
import { strict as assert } from "assert";
import { convertOne, convertAll } from "../dist/string-apostrophes.esm.js";

assert.deepEqual(
  convertAll(`In the '60s, rock 'n' roll`, {
    convertApostrophes: 1,
    convertEntities: 0,
  }),
  {
    result: "In the ’60s, rock ’n ’ roll",
    ranges: [
      [7, 8, "’"],
      [18, 19, "’"],
      [20, 21, "’"],
    ],
  }
);

assert.deepEqual(
  convertOne(`test's`, {
    from: 4,
    to: 5,
    convertApostrophes: true,
    convertEntities: false,
  }),
  [[4, 5, "&rsquo;"]]
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-apostrophes/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
