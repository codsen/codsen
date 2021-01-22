# string-remove-thousand-separators

> Detects and removes thousand separators (dot/comma/quote/space) from string-type digits

<div class="package-badges">
  <a href="https://www.npmjs.com/package/string-remove-thousand-separators" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/string-remove-thousand-separators" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://git.sr.ht/~royston/codsen/tree/master/packages/string-remove-thousand-separators" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-sourcehut-blue?style=flat-square" alt="page on sourcehut">
  </a>
  <a href="https://npmcharts.com/compare/string-remove-thousand-separators?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-remove-thousand-separators.svg?style=flat-square" alt="Downloads per month">
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
npm i string-remove-thousand-separators
```

## Quick Take

```js
import { strict as assert } from "assert";
import { remSep } from "string-remove-thousand-separators";

// 🇬🇧 🇺🇸 thousand separators:
assert.equal(remSep("1,000,000.00"), "1000000.00");

// 🇷🇺  thousand separators:
assert.equal(remSep("1 000 000,00"), "1000000,00");
// (if you want it converted to Western notation with dot,
// set opts.forceUKStyle = true

// 🇨🇭 thousand separators:
assert.equal(remSep("1'000'000.00"), "1000000.00");

// IT'S SMART TOO:

// will not delete if the thousand separators are mixed:
const input = "100,000,000.000";
assert.equal(remSep(input), input);
// ^ does nothing

// but will remove empty space, even if there is no decimal separator:
// (that's to cope with Russian notation integers that use thousand separators)
assert.equal(remSep("100 000 000 000"), "100000000000");

// while removing thousand separators, it will also pad the digits to two decimal places
// (optional, on by default, to turn it off set opts.padSingleDecimalPlaceNumbers to `false`):
assert.equal(remSep("100,000.2"), "100000.20");
console.log();
// ^ Western notation

assert.equal(remSep("100 000,2"), "100000,20");
// ^ Russian notation

assert.equal(remSep("100'000.2"), "100000.20");
// ^ Swiss notation
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-remove-thousand-separators/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors


<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">

