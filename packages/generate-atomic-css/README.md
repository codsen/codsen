# generate-atomic-css

> Generate Atomic CSS

<div class="package-badges">
  <a href="https://www.npmjs.com/package/generate-atomic-css" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/generate-atomic-css" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/generate-atomic-css" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/generate-atomic-css?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/generate-atomic-css.svg?style=flat-square" alt="Downloads per month">
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
npm i generate-atomic-css
```

If you need a legacy version which works with `require`, use version 1.5.0

## Quick Take

```js
import { strict as assert } from "assert";

import {
  genAtomic,
  version,
  headsAndTails,
  extractFromToSource,
} from "generate-atomic-css";

assert.deepEqual(
  genAtomic(
    `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10

.mt$$$ { margin-top: $$$px !important; } | 1
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */

tralala

/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`,
    {
      includeConfig: false,
      includeHeadsAndTails: false,
    }
  ),
  {
    log: { count: 8 },
    result: `a

.pb5  { padding-bottom:  5px !important; }
.pb6  { padding-bottom:  6px !important; }
.pb7  { padding-bottom:  7px !important; }
.pb8  { padding-bottom:  8px !important; }
.pb9  { padding-bottom:  9px !important; }
.pb10 { padding-bottom: 10px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }

z
`,
  }
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/generate-atomic-css/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors


<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">

