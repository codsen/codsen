<h1 align="center">csv-sort</h1>

<p align="center">Sort double-entry bookkeeping CSV from internet banking</p>

<p align="center">
  <a href="https://codsen.com/os/csv-sort" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/csv-sort" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/csv-sort" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/csv-sort?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/csv-sort.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/csv-sort/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 5.1.0 (`npm i csv-sort@5.1.0`).

```bash
npm i csv-sort
```

## Quick Take

```js
import { strict as assert } from "assert";

import { sort } from "csv-sort";

// Sorts double-entry bookkeeping CSV's - bank statements for example
// see https://en.wikipedia.org/wiki/Double-entry_bookkeeping

assert.deepEqual(
  sort(`Acc Number,Description,Debit Amount,Credit Amount,Balance,
123456,Client #1 payment,,1000,1940
123456,Bought carpet,30,,950
123456,Bought table,10,,940
123456,Bought pens,10,,1000
123456,Bought chairs,20,,980
`),
  {
    res: [
      ["Acc Number", "Description", "Debit Amount", "Credit Amount", "Balance"],
      ["123456", "Client #1 payment", "", "1000", "1940"],
      ["123456", "Bought table", "10", "", "940"],
      ["123456", "Bought carpet", "30", "", "950"],
      ["123456", "Bought chairs", "20", "", "980"],
      ["123456", "Bought pens", "10", "", "1000"],
    ],
    msgContent: null,
    msgType: null,
  },
);
// you'll have to join elements and lines from the array yourself
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/csv-sort/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2024 Roy Revelt and other contributors.

List of [currency signs](https://github.com/bengourley/currency-symbol-map) - Copyright © 2017 Ben Gourley - see its [BSD-2-Clause disclaimer](https://opensource.org/licenses/BSD-2-Clause)

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
