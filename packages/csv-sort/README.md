# csv-sort

> Sorts double-entry bookkeeping CSV coming from internet banking

<div class="package-badges">
  <a href="https://www.npmjs.com/package/csv-sort" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/csv-sort" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/csv-sort" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/csv-sort?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/csv-sort.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i csv-sort
```

## Quick Take

```js
import { strict as assert } from "assert";
import cSort from "csv-sort";

// Sorts double-entry bookkeeping CSV's - bank statements for example
// see https://en.wikipedia.org/wiki/Double-entry_bookkeeping

assert.deepEqual(
  cSort(`Acc Number,Description,Debit Amount,Credit Amount,Balance,
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
  }
);
// you'll have to join elements and lines from the array yourself
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/csv-sort/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

List of [currency signs](https://github.com/bengourley/currency-symbol-map) - Copyright © 2017 Ben Gourley - see its [BSD-2-Clause disclaimer](https://opensource.org/licenses/BSD-2-Clause)

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
