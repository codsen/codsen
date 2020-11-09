# string-find-heads-tails

> Finds where are arbitrary templating marker heads and tails located

<div class="package-badges">
  <a href="https://www.npmjs.com/package/string-find-heads-tails" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/string-find-heads-tails" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-Codsen-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://gitlab.com/codsen/codsen/tree/master/packages/string-find-heads-tails" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-GitLab-blue?style=flat-square" alt="page on GitLab">
  </a>
  <a href="https://npmcharts.com/compare/string-find-heads-tails?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-find-heads-tails.svg?style=flat-square" alt="Downloads per month">
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
npm i string-find-heads-tails
```

## Quick Take

```js
import { strict as assert } from "assert";
import strFindHeadsTails from "string-find-heads-tails";

// processing an arbitrary, custom templating markup:
assert.deepEqual(
  strFindHeadsTails(
    "some text %%_var1-%% more text %%_var2_%%",
    ["%%_", "%%-"], // two flavours of heads
    ["-%%", "_%%"] // two flavours of tails
  ),
  [
    {
      headsStartAt: 10,
      headsEndAt: 13,
      tailsStartAt: 17,
      tailsEndAt: 20,
    },
    {
      headsStartAt: 31,
      headsEndAt: 34,
      tailsStartAt: 38,
      tailsEndAt: 41,
    },
  ]
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-find-heads-tails/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2020 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
