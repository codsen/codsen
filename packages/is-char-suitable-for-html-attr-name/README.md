# is-char-suitable-for-html-attr-name

> Is given character suitable to be in an HTML attribute's name?

<div class="package-badges">
  <a href="https://www.npmjs.com/package/is-char-suitable-for-html-attr-name" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/is-char-suitable-for-html-attr-name" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/is-char-suitable-for-html-attr-name" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/is-char-suitable-for-html-attr-name?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/is-char-suitable-for-html-attr-name.svg?style=flat-square" alt="Downloads per month">
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
npm i is-char-suitable-for-html-attr-name
```

## Quick Take

```js
import { strict as assert } from "assert";
import is from "dist/is-char-suitable-for-html-attr-name.esm";

// Follows the spec:
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2

assert.equal(is("a"), true);
assert.equal(is("?"), false);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/is-char-suitable-for-html-attr-name/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
