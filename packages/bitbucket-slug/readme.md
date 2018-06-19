# bitbucket-slug

> Generate BitBucket readme header anchor slug URLs. Unofficial, covers whole ASCII and a bit beyond.

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#markdown-header-install)
- [Idea](#markdown-header-idea)
- [Difference from existing slug-generation libraries](#markdown-header-difference-from-existing-slug-generation-libraries)
- [Usage](#markdown-header-usage)
- [API](#markdown-header-api)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i bitbucket-slug
```

then,

```js
const bSlug = require("bitbucket-slug");
```

or

```js
import bSlug from "bitbucket-slug";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                         | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/bitbucket-slug.cjs.js` | 776 B |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/bitbucket-slug.esm.js` | 629 B |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/bitbucket-slug.umd.js` | 63 KB |

**[⬆ back to top](#markdown-header-bitbucket-slug)**

## Idea

BitBucket readme file headings are automatically linked with anchors.

This library generates those anchor links, just in case you want to generate a "**Table of Contents**" or programmatically generate links to any given BitBucket headings.

We backwards-engineered the BitBucket slug-generation algorithm, and it appears to be:

- Strip all punctuation (`.,;&`)
- Strip all emoji or non-letter characters (`🦄`, `♥` and, for example)
- Strip hashes which mean Markdown headings and single space that follows them (`##`)
- Replace each chunk of spaces with single hyphen
- Deburr (`déjà vu` -> `deja vu`; `ąžuolas` -> `azuolas`)
- Strip non-latin letters (Cyrillic, Hiragana, Katakana etc.)

In BitBucket README's, there's a rule that no two slugs can be the same. If BitBucket slug-generation function generates the same URL, it starts to append `_1`, `_2` on the first repeated slug onwards.

There are only two dependencies: [ent](https://www.npmjs.com/package/ent) to decode entities and [lodash.deburr](https://www.npmjs.com/package/lodash.deburr) to convert letters to basic Latin.

**[⬆ back to top](#markdown-header-bitbucket-slug)**

## Difference from existing slug-generation libraries

Whoever wonders, no, [slugify](https://github.com/sindresorhus/slugify) won't match the BitBucket heading slug generation API. There are peculiarities which differ.

This library, on another hand, is aiming to match BitBucket spec as close as possible. Our unit tests are pinning the output of this library against the BitBucket-rendered HTML.

**[⬆ back to top](#markdown-header-bitbucket-slug)**

## Usage

```js
const bSlug = require("bitbucket-slug");

const res1 = bSlug(`## So-called "music"`);
console.log("res1 = " + JSON.stringify(res1, null, 4));
// => "markdown-header-so-called-music"

// works with encoded HTML:
const res2 = bSlug("## Some Lithuanian - Ąžuolynas");
console.log("res2 = " + JSON.stringify(res2, null, 4));
// => "markdown-header-some-lithuanian-azuolynas"
```

**[⬆ back to top](#markdown-header-bitbucket-slug)**

## API

API is simple: `string` in, `string` out.

If the input is `undefined` or `null` or not a string - empty string will be returned.

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/bitbucket-slug/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/bitbucket-slug/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-bitbucket-slug)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/bitbucket-slug.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/bitbucket-slug
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/bitbucket-slug
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/bitbucket-slug/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/bitbucket-slug?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/bitbucket-slug
[downloads-img]: https://img.shields.io/npm/dm/bitbucket-slug.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/bitbucket-slug
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/bitbucket-slug
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/bitbucket-slug
