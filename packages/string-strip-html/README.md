<h1 align="center">string-strip-html</h1>

<p align="center">Strip HTML tags from strings. No parser, accepts mixed sources.</p>

<p align="center">
  <a href="https://codsen.com/os/string-strip-html" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/string-strip-html" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/string-strip-html" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/string-strip-html?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/string-strip-html.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/string-strip-html/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
  <a href="https://codsen.com/os/string-strip-html/play"><img src="https://img.shields.io/badge/playground-here-brightgreen?style=flat-square" alt="playground"></a>
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 8.5.0 (`npm i string-strip-html@8.5.0`).

```bash
npm i string-strip-html
```

## Quick Take

```js
import { strict as assert } from "assert";

import { stripHtml } from "string-strip-html";

assert.equal(
  stripHtml("Some text <b>and</b> text.").result,
  "Some text and text.",
);

// prevents accidental string concatenation
assert.equal(stripHtml("aaa<div>bbb</div>ccc").result, "aaa bbb ccc");

// tag pairs with content, upon request
assert.equal(
  stripHtml("a <pre><code>void a;</code></pre> b", {
    stripTogetherWithTheirContents: [
      "script", // default
      "style", // default
      "xml", // default
      "pre", // <-- custom-added
    ],
  }).result,
  "a b",
);

// detects raw, legit brackets:
assert.equal(stripHtml("a < b and c > d").result, "a < b and c > d");
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/string-strip-html/) for a full description of the API. Also, try the [GUI playground](https://codsen.com/os/string-strip-html/play).

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2023 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
