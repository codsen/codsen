# object-delete-key

> Delete keys from all arrays or plain objects, nested within anything, by key or by value or by both, and clean up afterwards. Accepts wildcards.

<div class="package-badges">
  <a href="https://www.npmjs.com/package/object-delete-key" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/object-delete-key" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/object-delete-key" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/object-delete-key?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/object-delete-key.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i object-delete-key
```

## Quick Take

```js
import { strict as assert } from "assert";
import deleteKey from "object-delete-key";

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

Please [visit codsen.com](https://codsen.com/os/object-delete-key/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
