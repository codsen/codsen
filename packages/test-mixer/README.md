# test-mixer

> Test helper to generate function opts object variations

<div class="package-badges">
  <a href="https://www.npmjs.com/package/test-mixer" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/test-mixer" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/test-mixer" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/test-mixer?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/test-mixer.svg?style=flat-square" alt="Downloads per month">
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

This package is ESM only: Node 12+ is needed to use it and it must be imported instead of required:

```bash
npm i test-mixer
```

If you need a legacy version which works with `require`, use version 2.1.0

## Quick Take

```js
import { strict as assert } from "assert";

import { mixer } from "test-mixer";

// check all possible combinations of all boolean opts:
const defaultOpts = {
  scrapeWindshield: true,
  checkOil: true,
  inflateTires: false,
  extinguishersCount: 1, // as non-boolean will be ignored
};

// generates 2^3 = 8 combinations all possible bools
assert.deepEqual(
  mixer(
    {
      // empty first arg object means you want all combinations
    },
    defaultOpts
  ),
  [
    {
      scrapeWindshield: false,
      checkOil: false,
      inflateTires: false,
      extinguishersCount: 1,
    },
    {
      scrapeWindshield: true,
      checkOil: false,
      inflateTires: false,
      extinguishersCount: 1,
    },
    {
      scrapeWindshield: false,
      checkOil: true,
      inflateTires: false,
      extinguishersCount: 1,
    },
    {
      scrapeWindshield: true,
      checkOil: true,
      inflateTires: false,
      extinguishersCount: 1,
    },
    {
      scrapeWindshield: false,
      checkOil: false,
      inflateTires: true,
      extinguishersCount: 1,
    },
    {
      scrapeWindshield: true,
      checkOil: false,
      inflateTires: true,
      extinguishersCount: 1,
    },
    {
      scrapeWindshield: false,
      checkOil: true,
      inflateTires: true,
      extinguishersCount: 1,
    },
    {
      scrapeWindshield: true,
      checkOil: true,
      inflateTires: true,
      extinguishersCount: 1,
    },
  ]
);

// let's "pin" a value, prepare two sets of options objects,
// one where scrapeWindshield === true and another with "false"

// you'll get 2 ^ (3-1) = 4 variations:
const variationsWithScrapeWindshieldOn = mixer(
  {
    scrapeWindshield: true,
  },
  defaultOpts
);
assert.deepEqual(variationsWithScrapeWindshieldOn, [
  {
    scrapeWindshield: true, // <--- pinned
    checkOil: false,
    inflateTires: false,
    extinguishersCount: 1,
  },
  {
    scrapeWindshield: true, // <--- pinned
    checkOil: true,
    inflateTires: false,
    extinguishersCount: 1,
  },
  {
    scrapeWindshield: true, // <--- pinned
    checkOil: false,
    inflateTires: true,
    extinguishersCount: 1,
  },
  {
    scrapeWindshield: true, // <--- pinned
    checkOil: true,
    inflateTires: true,
    extinguishersCount: 1,
  },
]);

// also 4 variations, similar but with scrapeWindshield === false pinned:
const variationsWithScrapeWindshieldOff = mixer(
  {
    scrapeWindshield: false,
  },
  defaultOpts
);
assert.equal(variationsWithScrapeWindshieldOff.length, 4);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/test-mixer/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors


<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">

