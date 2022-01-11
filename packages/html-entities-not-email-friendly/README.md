# html-entities-not-email-friendly

> All HTML entities which are not email template friendly

<div class="package-badges">
  <a href="https://www.npmjs.com/package/html-entities-not-email-friendly" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/html-entities-not-email-friendly" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/html-entities-not-email-friendly" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/html-entities-not-email-friendly?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/html-entities-not-email-friendly.svg?style=flat-square" alt="Downloads per month">
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

The latest version is **ESM only**: Node 12+ is needed to use it and it must be `import`ed instead of `require`d. If your project is not on ESM yet and you want to use `require`, use an older version of this program, `0.5.0`.

```bash
npm i html-entities-not-email-friendly
```

## Quick Take

```js
import { strict as assert } from "assert";

import {
  notEmailFriendly,
  notEmailFriendlySetOnly,
  notEmailFriendlyLowercaseSetOnly,
  notEmailFriendlyMinLength,
  notEmailFriendlyMaxLength,
} from "html-entities-not-email-friendly";

// it's object, mapping entity names to numeric equivalents
assert.equal(Object.keys(notEmailFriendly).length, 1841);

// it's a Set, only listing the bad entity names
assert.equal(notEmailFriendlySetOnly.size, 1841);

// is &GreaterTilde; email-friendly?
assert.equal(notEmailFriendlySetOnly.has("GreaterTilde"), true);
// no, use numeric entity

// is &nbsp; email-friendly?
assert.equal(notEmailFriendlySetOnly.has("nbsp"), false);
// yes, it's OK
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/html-entities-not-email-friendly/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2022 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
