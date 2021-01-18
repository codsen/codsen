# emlint

> Pluggable email template code linter

<div class="package-badges">
  <a href="https://www.npmjs.com/package/emlint" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/emlint" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://git.sr.ht/~royston/codsen/tree/master/packages/emlint" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-sourcehut-blue?style=flat-square" alt="page on sourcehut">
  </a>
  <a href="https://npmcharts.com/compare/emlint?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/emlint.svg?style=flat-square" alt="Downloads per month">
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
npm i emlint
```

## Quick Take

```js
import { strict as assert } from "assert";
import { Linter } from "emlint";
const linter = new Linter();

// Correct "not" type Outlook conditional would be:
// <!--[if !mso]><!-->
//   <img src="fallback"/>
// <!--<![endif]-->

// We have a "not" type opening but "only" type
// closing:
const messages = linter.verify(
  `<!--[if !mso]><!-->
  <img src="fallback"/>
<![endif]-->`,
  {
    rules: {
      all: 2,
    },
  }
);

assert.deepEqual(messages, [
  {
    line: 3,
    column: 1,
    severity: 2,
    ruleId: "comment-mismatching-pair",
    message: `Add "<!--".`,
    idxFrom: 44,
    idxTo: 56,
    fix: {
      ranges: [[44, 44, "<!--"]],
    },
    keepSeparateWhenFixing: true,
  },
]);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/emlint/) for a full description of the API and examples.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
