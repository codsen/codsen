# array-pull-all-with-glob

> PullAllWithGlob - like \_.pullAll but pulling stronger, with globs

<div class="package-badges">
  <a href="https://www.npmjs.com/package/array-pull-all-with-glob" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/array-pull-all-with-glob" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/array-pull-all-with-glob" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/array-pull-all-with-glob?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/array-pull-all-with-glob.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i array-pull-all-with-glob
```

## Quick Take

```js
import { strict as assert } from "assert";
import pullAllWithGlob from "array-pull-all-with-glob";

assert.deepEqual(
  pullAllWithGlob(
    ["keep_me", "name-1", "name-2", "name-jhkgdhgkhdfghdkghfdk"],
    ["name-*"]
  ),
  ["keep_me"]
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/array-pull-all-with-glob/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
