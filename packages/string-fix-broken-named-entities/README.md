# string-fix-broken-named-entities

> Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes

<div class="package-badges">
  <a href="https://www.npmjs.com/package/string-fix-broken-named-entities" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://codsen.com/os/string-fix-broken-named-entities" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-fix-broken-named-entities" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/string-fix-broken-named-entities?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-fix-broken-named-entities.svg?style=flat-square" alt="Downloads per month">
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
npm i string-fix-broken-named-entities
```

## Quick Take

```js
import { strict as assert } from "assert";
import { fixEnt } from "string-fix-broken-named-entities";
import { rApply } from "ranges-apply";

const source = "&nsp;x&nsp;y&nsp;";

// returns Ranges notation, see codsen.com/ranges/
assert.deepEqual(fixEnt(source), [
  [0, 5, "&nbsp;"],
  [6, 11, "&nbsp;"],
  [12, 17, "&nbsp;"],
]);

// render result from ranges using "ranges-apply":
assert.equal(rApply(source, fixEnt(source)), "&nbsp;x&nbsp;y&nbsp;");
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-fix-broken-named-entities/) for a full description of the API, examples and even a test <a href="https://codsen.com/os/string-fix-broken-named-entities/play">playground</a>.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
