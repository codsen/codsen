# html-table-patcher

> Visual helper to place templating code around table tags into correct places

<div class="package-badges">
  <a href="https://www.npmjs.com/package/html-table-patcher" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/html-table-patcher" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/html-table-patcher" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/html-table-patcher?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/html-table-patcher.svg?style=flat-square" alt="Downloads per month">
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

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 4.1.0 (`npm i html-table-patcher@4.1.0`).

```bash
npm i html-table-patcher
```

## Quick Take

```js
import { strict as assert } from "assert";

import { patcher } from "html-table-patcher";

assert.equal(
  patcher(
    `<table>
{% if customer.details.hasAccount %}
<tr>
  <td>
    variation #1
  </td>
</tr>
{% else %}
<tr>
  <td>
    variation #2
  </td>
</tr>
{% endif %}
</table>`
  ).result,
  `<table>

<tr>
  <td>
    {% if customer.details.hasAccount %}
  </td>
</tr>

<tr>
  <td>
    variation #1
  </td>
</tr>

<tr>
  <td>
    {% else %}
  </td>
</tr>

<tr>
  <td>
    variation #2
  </td>
</tr>

<tr>
  <td>
    {% endif %}
  </td>
</tr>

</table>`
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/html-table-patcher/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2022 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
