<h1 align="center">html-all-known-attributes</h1>

<p align="center">All HTML attributes known to the Humanity</p>

<p align="center">
  <a href="https://codsen.com/os/html-all-known-attributes" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/html-all-known-attributes" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/html-all-known-attributes" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/html-all-known-attributes?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/html-all-known-attributes.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/html-all-known-attributes/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 4.1.0 (`npm i html-all-known-attributes@4.1.0`).

```bash
npm i html-all-known-attributes
```

## Quick Take

```js
import { strict as assert } from "assert";

import { allHtmlAttribs } from "html-all-known-attributes";

assert.equal(allHtmlAttribs.has("href"), true);

assert.equal(allHtmlAttribs.size, 702);

// iterating:
const gathered = [];
for (let x of allHtmlAttribs) {
  // push first three
  if (gathered.length < 3) {
    gathered.push(x);
  }
}
assert.deepEqual(gathered, ["abbr", "accept", "accept-charset"]);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/html-all-known-attributes/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2022 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
