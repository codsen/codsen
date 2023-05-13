<h1 align="center">detect-templating-language</h1>

<p align="center">Detects various templating languages present in string</p>

<p align="center">
  <a href="https://codsen.com/os/detect-templating-language" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/detect-templating-language" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/detect-templating-language" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/detect-templating-language?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/detect-templating-language.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/detect-templating-language/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 2.1.0 (`npm i detect-templating-language@2.1.0`).

```bash
npm i detect-templating-language
```

## Quick Take

```js
import { strict as assert } from "assert";

import { detectLang } from "detect-templating-language";

// detects Nunjucks
assert.deepEqual(
  detectLang("<div>{% if something %}x{% else %}y{% endif %}</div>"),
  { name: "Nunjucks" }
);

// detects JSP (Java Server Pages)
assert.deepEqual(
  detectLang('<div><c:set var="someList" value="${jspProp.someList}" /></div>'),
  { name: "JSP" }
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/detect-templating-language/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2023 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
