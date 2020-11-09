# ast-deep-contains

> Like t.same assert on array of objects, where element order doesn't matter.

<div class="package-badges">
  <a href="https://www.npmjs.com/package/ast-deep-contains" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/ast-deep-contains" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/ast-deep-contains" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/ast-deep-contains?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/ast-deep-contains.svg?style=flat-square" alt="Downloads per month">
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
npm i ast-deep-contains
```

## Quick Take

```js
import { strict as assert } from "assert";
import deepContains from "ast-deep-contains";

const gathered = [];
const errors = [];

const reference = [
  { c: "2" }, // will end up not used
  { a: "1", b: "2", c: "3" },
  { x: "8", y: "9", z: "0" },
];

const structureToMatch = [
  { a: "1", b: "2", c: "3" }, // matches but has different position in the source
  { x: "8", y: "9" }, // "z" missing
];

// This program pre-matches first, then matches objects as a set-subset
deepContains(
  reference,
  structureToMatch,
  (leftSideVal, rightSideVal) => {
    // This callback does the pre-matching and picks the key pairs for you.
    // It's up to you what you will do with left- and right-side
    // values - we normally feed them to unit test asserts but here we just push
    // to array:
    gathered.push([leftSideVal, rightSideVal]);
  },
  (err) => {
    errors.push(err);
  }
);

// imagine instead of pushing pairs into array, you fed them into assert
// function in unit tests:
assert.deepEqual(gathered, [
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["8", "8"],
  ["9", "9"],
]);
assert.equal(errors.length, 0);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/ast-deep-contains/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
