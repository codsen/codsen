# object-delete-key

> Delete keys from all arrays or plain objects, nested within anything, by key or by value or by both, and clean up afterwards. Accepts wildcards.

<div class="package-badges">
  <a href="https://www.npmjs.com/package/object-delete-key" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/object-delete-key" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/object-delete-key" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/object-delete-key?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/object-delete-key.svg?style=flat-square" alt="Downloads per month">
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
npm i object-delete-key
```

If you need a legacy version which works with `require`, use version 2.1.0

## Quick Take

```js
import { strict as assert } from "assert";

import { deleteKey } from "object-delete-key";

// deleting key 'c', with value 'd'
assert.deepEqual(
  deleteKey(
    {
      a: "b",
      c: "d",
    },
    {
      key: "c",
      val: "d",
    }
  ),
  { a: "b" }
);

// deleting key 'b' with value - array ['c', 'd']
assert.deepEqual(
  deleteKey(
    {
      a: { e: [{ b: ["c", "d"] }] },
      b: ["c", "d"],
    },
    {
      key: "b",
      val: ["c", "d"],
    }
  ),
  {}
);
// notice program cleaned after itself, it didn't leave empty "a" key
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/object-delete-key/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors


<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">

