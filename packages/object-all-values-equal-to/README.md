# object-all-values-equal-to

> Does the AST/nested-plain-object/array/whatever contain only one kind of value?

<div class="package-badges">
  <a href="https://www.npmjs.com/package/object-all-values-equal-to" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/object-all-values-equal-to" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/object-all-values-equal-to" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/object-all-values-equal-to?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/object-all-values-equal-to.svg?style=flat-square" alt="Downloads per month">
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
npm i object-all-values-equal-to
```

## Quick Take

```js
import { strict as assert } from "assert";
import allEqualTo from "object-all-values-equal-to";

// are all values equal to null:
assert.equal(allEqualTo({ a: null, c: null }, null), true);
// yes

// are all values equal to "false":
assert.equal(allEqualTo({ a: false, c: "zzz" }, false), false);
// no

// are all values equal to "false"?
assert.equal(
  allEqualTo(
    {
      a: {
        b: false,
        c: [
          {
            d: false,
            e: false,
          },
          {
            g: false,
          },
        ],
      },
      c: false,
    },
    false // reference value to check
  ),
  true // answer is, yes
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/object-all-values-equal-to/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
