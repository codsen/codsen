<h1 align="center">color-shorthand-hex-to-six-digit</h1>

<p align="center">Convert shorthand hex color codes into full</p>

<p align="center">
  <a href="https://codsen.com/os/color-shorthand-hex-to-six-digit" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/color-shorthand-hex-to-six-digit" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/color-shorthand-hex-to-six-digit" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/color-shorthand-hex-to-six-digit?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/color-shorthand-hex-to-six-digit.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/color-shorthand-hex-to-six-digit/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 3.1.0 (`npm i color-shorthand-hex-to-six-digit@3.1.0`).

```bash
npm i color-shorthand-hex-to-six-digit
```

## Quick Take

```js
import { strict as assert } from "assert";

import { conv } from "color-shorthand-hex-to-six-digit";

// converts shorthand hex color codes within strings (imagine that could be
// email template source code):
assert.equal(
  conv("aaaa #f0c zzzz\n\t\t\t#fc0"),
  "aaaa #ff00cc zzzz\n\t\t\t#ffcc00"
);

// converts shorthand hex colour codes within plain objects:
assert.deepEqual(
  conv({
    a: "#ffcc00",
    b: "#f0c",
    c: "text",
  }),
  {
    a: "#ffcc00",
    b: "#ff00cc",
    c: "text",
  }
);

// converts shorthand hex colour codes within arrays:
assert.deepEqual(conv(["#fc0", "#f0c", "text", ""]), [
  "#ffcc00",
  "#ff00cc",
  "text",
  "",
]);

// converts shorthand hex colour codes within nested spaghetti's:
assert.deepEqual(
  conv([[[[[[{ x: ["#fc0"] }]]]]], { z: "#f0c" }, ["text"], { y: "" }]),
  [[[[[[{ x: ["#ffcc00"] }]]]]], { z: "#ff00cc" }, ["text"], { y: "" }]
);

// in all other cases it silently returns the input:
assert.equal(conv(null), null);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/color-shorthand-hex-to-six-digit/) for a full description of the API.

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License.

Copyright © 2010-2023 Roy Revelt and other contributors.

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
