# array-includes-with-glob

> like \_.includes but with wildcards

<div class="package-badges">
  <a href="https://www.npmjs.com/package/array-includes-with-glob" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/array-includes-with-glob" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/array-includes-with-glob" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/array-includes-with-glob?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/array-includes-with-glob.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i array-includes-with-glob
```

## Quick Take

```js
import { strict as assert } from "assert";
import includesWithGlob from "array-includes-with-glob";

assert.equal(includesWithGlob(["xc", "yc", "zc"], "*c"), true);
// (all 3)

assert.equal(includesWithGlob(["xc", "yc", "zc"], "*a"), false);
// (none found)

assert.equal(includesWithGlob(["something", "anything", "zzz"], "some*"), true);
// (1 hit)
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/array-includes-with-glob/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
