# detect-is-it-html-or-xhtml

> Answers, is the string input string more an HTML or XHTML (or neither)

<div class="package-badges">
  <a href="https://www.npmjs.com/package/detect-is-it-html-or-xhtml" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/detect-is-it-html-or-xhtml" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/detect-is-it-html-or-xhtml" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/detect-is-it-html-or-xhtml?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/detect-is-it-html-or-xhtml.svg?style=flat-square" alt="Downloads per month">
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
npm i detect-is-it-html-or-xhtml
```

## Quick Take

```js
import { strict as assert } from "assert";
import detectIsItHTMLOrXhtml from "detect-is-it-html-or-xhtml";

assert.equal(
  detectIsItHTMLOrXhtml(
    `<img src="some.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/>`
  ),
  "xhtml"
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/detect-is-it-html-or-xhtml/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
