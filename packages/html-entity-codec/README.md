<h1 align="center">html-entity-codec</h1>

<p align="center">Decode, encode, and escape HTML character references</p>

<p align="center">
  <a href="https://codsen.com/os/html-entity-codec" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-codsen-blue?style=flat-square" alt="page on codsen.com">
  </a>
  <a href="https://www.npmjs.com/package/html-entity-codec" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-npm-blue?style=flat-square" alt="page on npm">
  </a>
  <a href="https://github.com/codsen/codsen/tree/main/packages/html-entity-codec" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/-github-blue?style=flat-square" alt="page on github">
  </a>
  <a href="https://npmcharts.com/compare/html-entity-codec?interval=30" rel="nofollow noreferrer noopener" target="_blank">
    <img src="https://img.shields.io/npm/dm/html-entity-codec.svg?style=flat-square" alt="Downloads per month">
  </a>
  <a href="https://codsen.com/os/html-entity-codec/changelog" rel="nofollow noreferrer noopener">
    <img src="https://img.shields.io/badge/changelog-here-brightgreen?style=flat-square" alt="changelog">
  </a>
  <img src="https://img.shields.io/badge/licence-MIT-brightgreen.svg?style=flat-square" alt="MIT Licence">
</p>

**No dependencies whatsoever.** This package declares no dependencies or devDependencies.

## Features

HTML character-reference transformations from pinned WHATWG data.

- Decode in one pass with text or attribute context and explicit semicolon and parse-error policies.
- Encode with stable named aliases or uppercase hexadecimal references; the dedicated numeric encoder lets bundlers omit named data.
- Escape quoted attributes and ordinary HTML text, with optional progress and completion callbacks.
- Keep source offsets through the reference scanner.

## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

```bash
npm i html-entity-codec
```

## Quick Take

```js
import assert from "node:assert/strict";
import { decode } from "html-entity-codec";

assert.equal(
  decode("Cat &amp; fiddle &#128572;&#127931;"),
  "Cat & fiddle 😼🎻",
);
```


## Documentation

Please [visit codsen.com](https://codsen.com/os/html-entity-codec/) for a full description of the API. For **Changelog**, see [raw md on GitHub](https://github.com/codsen/codsen/blob/main/packages/html-entity-codec/CHANGELOG.md) or [the website](https://codsen.com/os/html-entity-codec/changelog).

## Contributing

To report bugs or request features or assistance, [raise an issue](https://github.com/codsen/codsen/issues/new/choose) on GitHub.

## Licence

MIT License

Copyright © 2010-2026 Roy Revelt and other contributors

HTML [named character references](https://html.spec.whatwg.org/entities.json) - Copyright © WHATWG (Apple, Google, Mozilla, Microsoft) - see its [BSD-3-Clause disclaimer](https://opensource.org/licenses/BSD-3-Clause)

<p align="center"><img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center"></p>
