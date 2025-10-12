<h1 align="center">json-comb-core</h1>

<p align="center">The inner core of json-comb</p>

<p align="center">
  <a href="https://codsen.com/os/json-comb-core" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/json-comb-core" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/json-comb-core" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/json-comb-core?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/json-comb-core.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/json-comb-core/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 6.9.0 (`npm i json-comb-core@6.9.0`).

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
} from "json-comb-core";

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
    schema,
  ),
  {
    a: "a",
    b: false,
    c: {
      d: false,
      e: false,
      f: false,
    },
  },
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/json-comb-core/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright © 2010-2025 Roy Revelt and other contributors

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
