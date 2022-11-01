<h1 align="center">ranges-push</h1>

<p align="center">Gather string index ranges</p>

<p align="center">
  <a href="https://codsen.com/os/ranges-push" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/ranges-push" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/ranges-push" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/ranges-push?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/ranges-push.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/ranges-push/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 5.1.0 (`npm i ranges-push@5.1.0`).

```bash
npm i ranges-push
```

## Quick Take

```js
import { strict as assert } from "assert";

import { Ranges } from "ranges-push";
import { rApply } from "ranges-apply";

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
  rApply(oldString, gatheredRanges.current()),
  "The bad grey wolf jumps over the little Red Riding Hood."
);

// wipe all gathered ranges
gatheredRanges.wipe();
assert.equal(gatheredRanges.current(), null);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/ranges-push/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2022 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
