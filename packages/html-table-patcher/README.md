# html-table-patcher

> Visual helper to place templating code around table tags into correct places

<div class="package-badges">
  <a href="https://www.npmjs.com/package/html-table-patcher" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/html-table-patcher" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/html-table-patcher" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/html-table-patcher?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/html-table-patcher.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i html-table-patcher
```

## Quick Take

```js
import { strict as assert } from "assert";
import { patcher } from "dist/html-table-patcher.esm";

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

Please [visit codsen.com](https://codsen.com/os/html-table-patcher/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
