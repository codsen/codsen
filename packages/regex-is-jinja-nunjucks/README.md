# regex-is-jinja-nunjucks

> Regular expression for detecting Jinja or Nunjucks code

<div class="package-badges">
  <a href="https://www.npmjs.com/package/regex-is-jinja-nunjucks" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/regex-is-jinja-nunjucks" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/regex-is-jinja-nunjucks" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/regex-is-jinja-nunjucks?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/regex-is-jinja-nunjucks.svg?style=flat-square" alt="Downloads per month">
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
npm i regex-is-jinja-nunjucks
```

If you need a legacy version which works with require, use version 2.1.0

## Quick Take

```js
import { strict as assert } from "assert";
import { isJinjaNunjucksRegex } from "regex-is-jinja-nunjucks";

// detects Jinja/Nunjucks code
assert.equal(
  isJinjaNunjucksRegex().test(
    `<div>{% if data.purchases.count > 1 %}these{% else %}this{% endif %}</div>`
  ),
  true
);

// in case if it's not nunjucks
assert.equal(isJinjaNunjucksRegex().test(`<div>tralala</div>`), false);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/regex-is-jinja-nunjucks/) for a full description of the API and examples.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
