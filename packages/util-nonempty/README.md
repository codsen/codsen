# util-nonempty

> Is the input (plain object, array, string or whatever) not empty?

<div class="package-badges">
  <a href="https://www.npmjs.com/package/util-nonempty" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/util-nonempty" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://git.sr.ht/~royston/codsen/tree/master/packages/util-nonempty" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-sourcehut-blue?style=flat-square" alt="page on sourcehut">
  </a>
  <a href="https://npmcharts.com/compare/util-nonempty?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/util-nonempty.svg?style=flat-square" alt="Downloads per month">
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
npm i util-nonempty
```

## Quick Take

```js
import { strict as assert } from "assert";
import { nonEmpty } from "util-nonempty";

assert.equal(nonEmpty("z"), true);
assert.equal(nonEmpty(""), false);
assert.equal(nonEmpty(["a"]), true);
assert.equal(nonEmpty([123]), true);
assert.equal(nonEmpty([[[[[[[[[[[]]]]]]]]]]]), true);
assert.equal(nonEmpty({ a: "" }), true);
assert.equal(nonEmpty({ a: "a" }), true);
assert.equal(nonEmpty({}), false);

const f = () => {
  return "z";
};
assert.equal(nonEmpty(f), false);
// (answer is instantly false if input is not array, plain object or string)
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/util-nonempty/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors


<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">

