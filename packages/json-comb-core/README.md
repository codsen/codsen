# json-comb-core

> The inner core of json-comb

<div class="package-badges">
  <a href="https://www.npmjs.com/package/json-comb-core" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/json-comb-core" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://git.sr.ht/~royston/codsen/tree/master/packages/json-comb-core" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-sourcehut-blue?style=flat-square" alt="page on sourcehut">
  </a>
  <a href="https://npmcharts.com/compare/json-comb-core?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/json-comb-core.svg?style=flat-square" alt="Downloads per month">
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
npm i json-comb-core
```

## Quick Take

```js
import { strict as assert } from "assert";
import {
  getKeysetSync,
  getKeyset,
  enforceKeyset,
  enforceKeysetSync,
  sortAllObjectsSync,
  noNewKeysSync,
  findUnusedSync,
} from "dist/json-comb-core.esm";

// STEP #1
// =======

// calculate the schema - superset of all possible keys used across
// all JSON files
const schema = getKeysetSync([
  {
    // <- object #1
    a: "a",
    b: "c",
    c: {
      d: "d",
      e: "e",
    },
  },
  {
    // <- object #2
    a: "a",
  },
  {
    // <- object #3
    c: {
      f: "f",
    },
  },
]);

assert.deepEqual(schema, {
  a: false,
  b: false,
  c: {
    d: false,
    e: false,
    f: false,
  },
});

// STEP #2
// =======

// now we can normalise the object #2 for example:
assert.deepEqual(
  enforceKeysetSync(
    {
      // <- object #2
      a: "a",
    },
    schema
  ),
  {
    a: "a",
    b: false,
    c: {
      d: false,
      e: false,
      f: false,
    },
  }
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/json-comb-core/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors


<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">

