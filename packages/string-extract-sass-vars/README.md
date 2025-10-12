<h1 align="center">string-extract-sass-vars</h1>

<p align="center">Parse SASS variables file into a plain object of CSS key-value pairs</p>

<p align="center">
  <a href="https://codsen.com/os/string-extract-sass-vars" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/string-extract-sass-vars" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-extract-sass-vars" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/string-extract-sass-vars?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-extract-sass-vars.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/string-extract-sass-vars/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 2.1.0 (`npm i string-extract-sass-vars@2.1.0`).

```bash
npm i string-extract-sass-vars
```

## Quick Take

```js
import { strict as assert } from "assert";

import { extractVars } from "string-extract-sass-vars";

assert.deepEqual(
  extractVars(`// all variables are here!!!
// ------------------------------------------
$red: #ff6565; // this is red
// $green: #63ffbd; // no green here
$yellow: #ffff65; // this is yellow
$blue: #08f0fd; // this is blue
$fontfamily: Helvetica, sans-serif;
$border: 1px solid #dedede;
$borderroundedness: 3px;
$customValue1: tralala;
$customValue2: tralala;
// don't mind this comment about #ff6565;
$customValue3: 10;`),
  {
    red: "#ff6565",
    yellow: "#ffff65",
    blue: "#08f0fd",
    fontfamily: "Helvetica, sans-serif",
    border: "1px solid #dedede",
    borderroundedness: "3px",
    customValue1: "tralala",
    customValue2: "tralala",
    customValue3: 10,
  },
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-extract-sass-vars/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright © 2010-2025 Roy Revelt and other contributors

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
