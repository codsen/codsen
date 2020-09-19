# string-unfancy

> Replace all n/m dashes, curly quotes with their simpler equivalents

<div class="package-badges">
  <a href="https://www.npmjs.com/package/string-unfancy" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/string-unfancy" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/string-unfancy" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/string-unfancy?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-unfancy.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://prettier.io" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/badge/code_style-prettier-brightgreen.svg?style=flat-square" alt="Code style: prettier">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT License">
</div>

## Install

```bash
npm i string-unfancy
```

## Quick Take

```js
import { strict as assert } from "assert";
import unfancy from "string-unfancy";

// U+2019
// https://www.fileformat.info/info/unicode/char/2019/index.htm
// https://mothereff.in/js-escapes
const rightSingleQuote = "\u2019";

assert.equal(unfancy(`someone${rightSingleQuote}s`), "someone's");

// works with encoded HTML:
assert.equal(unfancy("someone&rsquo;s"), "someone's");
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-unfancy/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
