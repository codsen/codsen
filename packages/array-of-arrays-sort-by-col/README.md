# array-of-arrays-sort-by-col

> sort array of arrays by column, rippling the sorting outwards from that column

<div class="package-badges">
  <a href="https://www.npmjs.com/package/array-of-arrays-sort-by-col" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/array-of-arrays-sort-by-col" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/array-of-arrays-sort-by-col" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/array-of-arrays-sort-by-col?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/array-of-arrays-sort-by-col.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i array-of-arrays-sort-by-col
```

## Quick Take

```js
import { strict as assert } from "assert";
import sortBySubarray from "array-of-arrays-sort-by-col";

// sort by second column, index number 1
assert.deepEqual(sortBySubarray([[1, 9, 4], [1], [1, 9, 3], [1, 9, 2]], 1), [
  [1, 9, 2],
  [1, 9, 3],
  [1, 9, 4],
  [1],
]);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/array-of-arrays-sort-by-col/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
