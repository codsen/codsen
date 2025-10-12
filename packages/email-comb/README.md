<h1 align="center">email-comb</h1>

<p align="center">Remove unused CSS from email templates</p>

<p align="center">
  <a href="https://codsen.com/os/email-comb" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/email-comb" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/email-comb" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/email-comb?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/email-comb.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/email-comb/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
  <a href="https://codsen.com/os/email-comb/play"><img src="https://img.shields.io/badge/playground-here-brightgreen?style=flat-square" alt="playground"></a>
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 5.3.1 (`npm i email-comb@5.3.1`).

```bash
npm i email-comb
```

## Quick Take

```js
import { strict as assert } from "assert";
import { comb, defaults, version } from "email-comb";

const source = `<head>
<style type="text/css">
.unused1[z] {a:1;}
.used[z] {a:2;}
</style>
</head>
<body class="  used  "><a class="used unused3">z</a>
</body>
`;

const intended = `<head>
<style type="text/css">
.used[z] {a:2;}
</style>
</head>
<body class="used"><a class="used">z</a>
</body>
`;

assert.equal(comb(source).result, intended);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/email-comb/) for a full description of the API. Also, try the [GUI playground](https://codsen.com/os/email-comb/play).

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright © 2010-2025 Roy Revelt and other contributors

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
