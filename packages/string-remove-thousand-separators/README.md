<h1 align="center">string-remove-thousand-separators</h1>

<p align="center">Detects and removes thousand separators (dot/comma/quote/space) from string-type digits</p>

<p align="center">
  <a href="https://codsen.com/os/string-remove-thousand-separators" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/string-remove-thousand-separators" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-remove-thousand-separators" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/string-remove-thousand-separators?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-remove-thousand-separators.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/string-remove-thousand-separators/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 5.1.0 (`npm i string-remove-thousand-separators@5.1.0`).

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

Please [visit codsen.com](https://codsen.com/os/string-remove-thousand-separators/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2022 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
