# util-array-object-or-both

> Validate and normalise user choice: array, object or both?

<div class="package-badges">
  <a href="https://www.npmjs.com/package/util-array-object-or-both" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/util-array-object-or-both" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/util-array-object-or-both" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/util-array-object-or-both?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/util-array-object-or-both.svg?style=flat-square" alt="Downloads per month">
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
npm i util-array-object-or-both
```

## Quick Take

```js
import { strict as assert } from "assert";
import { arrObjOrBoth } from "util-array-object-or-both";

// normalises string, a user preference:

assert.equal(arrObjOrBoth("arrays"), "array");
assert.equal(arrObjOrBoth("array"), "array");
assert.equal(arrObjOrBoth("arr"), "array");
assert.equal(arrObjOrBoth("a"), "array");

assert.equal(arrObjOrBoth("objects"), "object");
assert.equal(arrObjOrBoth("object"), "object");
assert.equal(arrObjOrBoth("obj"), "object");
assert.equal(arrObjOrBoth("o"), "object");

assert.equal(arrObjOrBoth("whatever"), "any");
assert.equal(arrObjOrBoth("either"), "any");
assert.equal(arrObjOrBoth("both"), "any");
assert.equal(arrObjOrBoth("any"), "any");
assert.equal(arrObjOrBoth("all"), "any");
assert.equal(arrObjOrBoth("e"), "any");
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/util-array-object-or-both/) for a full description of the API and examples.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
