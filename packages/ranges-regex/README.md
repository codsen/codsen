# ranges-regex

> Integrate regex operations into Ranges workflow

<div class="package-badges">
  <a href="https://www.npmjs.com/package/ranges-regex" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/ranges-regex" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/ranges-regex" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/ranges-regex?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/ranges-regex.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i ranges-regex
```

## Quick Take

```js
import { strict as assert } from "assert";
import raReg from "ranges-regex";

const oldString = `The quick brown fox jumps over the lazy dog.`;
const result = raReg(/the/gi, oldString);

// all regex matches, but in Ranges notation (see codsen.com/ranges/):
assert.deepEqual(result, [
  [0, 3],
  [31, 34],
]);

// if you slice the ranges, you'll get original regex caught values:
assert.deepEqual(
  result.map(([from, to]) => oldString.slice(from, to)),
  ["The", "the"]
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/ranges-regex/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
