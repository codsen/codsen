<h1 align="center">stristri</h1>

<p align="center">Extracts or deletes HTML, CSS, text and/or templating tags from string</p>

<p align="center">
  <a href="https://codsen.com/os/stristri" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/stristri" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/stristri" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/stristri?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/stristri.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/stristri/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 3.2.0 (`npm i stristri@3.2.0`).

```bash
npm i stristri
```

## Quick Take

```js
import { strict as assert } from "assert";

import { stri } from "stristri";

// strips both HTML and Nunjucks, leaves text only:
assert.equal(
  stri(
    "<html><div>The price is{% if data.price > 100 %} high{% endif %}</div>",
    {
      html: true,
      css: true,
      text: false,
      templatingTags: true,
    },
  ).result,
  "The price is high",
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/stristri/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2025 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
