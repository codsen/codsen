# bitbucket-slug

> Generate BitBucket readme header anchor slug URLs. Unofficial, covers whole ASCII and a bit beyond.

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [Difference from existing slug-generation libraries](#difference-from-existing-slug-generation-libraries)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i bitbucket-slug
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`bSlug`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const bSlug = require("bitbucket-slug");
```

or as an ES Module:

```js
import bSlug from "bitbucket-slug";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/bitbucket-slug/dist/bitbucket-slug.umd.js"></script>
```

```js
// in which case you get a global variable "bitbucketSlug" which you consume like this:
const bSlug = bitbucketSlug;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                         | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/bitbucket-slug.cjs.js` | 1 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/bitbucket-slug.esm.js` | 726 B |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/bitbucket-slug.umd.js` | 62 KB |

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

## Difference from existing slug-generation libraries

Whoever wonders, no, [slugify](https://github.com/sindresorhus/slugify) won't match the BitBucket heading slug generation API. There are peculiarities which differ.

This library, on another hand, is aiming to match BitBucket spec as close as possible. Our unit tests are pinning the output of this library against the BitBucket-rendered HTML.

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

## API

API is simple: `string` in, `string` out.

If the input is `undefined` or `null` or not a string - empty string will be returned.

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=bitbucket-slug%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Abitbucket-slug%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=bitbucket-slug%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Abitbucket-slug%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=bitbucket-slug%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Abitbucket-slug%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/bitbucket-slug
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/bitbucket-slug
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/bitbucket-slug
[downloads-img]: https://img.shields.io/npm/dm/bitbucket-slug.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/bitbucket-slug
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/bitbucket-slug
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
