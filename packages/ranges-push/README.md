# ranges-push

> Gather string index ranges

<div class="package-badges">
  <a href="https://www.npmjs.com/package/ranges-push" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/ranges-push" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/ranges-push?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/ranges-push.svg?style=flat-square" alt="Downloads per month">
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
npm i ranges-push
```

## Quick Take

```js
import { strict as assert } from "assert";
import Ranges from "ranges-push";
import applyR from "ranges-apply";

const gatheredRanges = new Ranges();

const oldString = `The quick brown fox jumps over the lazy dog.`;

// push the ranges
gatheredRanges.push(35, 43, "little Red Riding Hood");
gatheredRanges.push(4, 19, "bad grey wolf");

// retrieve the merged and sorted ranges by calling .current()
assert.deepEqual(gatheredRanges.current(), [
  [4, 19, "bad grey wolf"],
  [35, 43, "little Red Riding Hood"],
]);

assert.equal(
  applyR(oldString, gatheredRanges.current()),
  "The bad grey wolf jumps over the little Red Riding Hood."
);

// wipe all gathered ranges
gatheredRanges.wipe();
assert.equal(gatheredRanges.current(), null);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/ranges-push/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
