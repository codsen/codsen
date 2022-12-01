<h1 align="center">remark-typography</h1>

<p align="center">Remark plugin to fix typography: quotes, dashes and so on.</p>

<p align="center">
  <a href="https://codsen.com/os/remark-typography" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/remark-typography" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/remark-typography" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/remark-typography?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/remark-typography.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/remark-typography/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is not pure ESM, you can `require` it.

```bash
npm i remark-typography
```

## Quick Take

```js
import { strict as assert } from "assert";
import { remark } from "remark";

import fixTypography from "remark-typography";

(async () => {
  assert.equal(
    (await remark().use(fixTypography, {}).process("Yes that's true but..."))
      .toString()
      .trim(),
    `Yes that\u2019s true\u00A0but\u2026`
  );
})();
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/remark-typography/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2022 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
