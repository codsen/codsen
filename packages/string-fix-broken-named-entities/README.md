<h1 align="center">string-fix-broken-named-entities</h1>

<p align="center">Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes</p>

<p align="center">
  <a href="https://codsen.com/os/string-fix-broken-named-entities" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/string-fix-broken-named-entities" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-fix-broken-named-entities" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/string-fix-broken-named-entities?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-fix-broken-named-entities.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/string-fix-broken-named-entities/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 5.4.0 (`npm i string-fix-broken-named-entities@5.4.0`).

```bash
npm i string-fix-broken-named-entities
```

## Quick Take

```js
import { strict as assert } from "assert";
import { rApply } from "ranges-apply";

import { fixEnt } from "string-fix-broken-named-entities";

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

Please [visit codsen.com](https://codsen.com/os/string-fix-broken-named-entities/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2025 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
