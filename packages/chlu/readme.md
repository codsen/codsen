# Chlu

> CH-ange-L-og U-pdate - Automatically fix errors in your changelog file

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
- [What it does](#markdown-header-what-it-does)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```sh
npm i chlu
```

Here's what you'll get:

| Type                                                                                               | Key in `package.json` | Path               | Size  |
| -------------------------------------------------------------------------------------------------- | --------------------- | ------------------ | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`     | `main`                | `dist/chlu.cjs.js` | 18 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/chlu.esm.js` | 18 KB |

**[⬆ back to top](#markdown-header-chlu)**

## What it does

`chlu` stands for CHangeLog Update. This library is the API for [`chlu-cli`](https://bitbucket.org/codsen/chlu-cli) which you should install with a `-g` flag. You probably should check it [instead](https://bitbucket.org/codsen/chlu-cli).

Diff links are useful for new starters in programming — they allow to see how the particular feature was implemented and _learn_.
Diff links are useful for regular consumers of npm libraries — they give more reassurance that the library is really maintained and provide a glimpse about its quality.

When I saw the diff links for the first time in somebody's CHANGELOG, I told myself, I must get one too. However, diff links are a pain to maintain, hence this library. Make sure you install [chlu-cli](https://bitbucket.org/codsen/chlu-cli) though. This one is just an API for it.

**[⬆ back to top](#markdown-header-chlu)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/chlu/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/chlu/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-chlu)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

Unit test #13 - uses changelog of **giu 0.13.4** to test automated error fixing, released under MIT License (MIT) Copyright © 2016-2018 Guillermo Grau Panea
Unit test #14 - uses changelog of **keystone 4.0.0-beta.5** to test automated error fixing, released under MIT License (MIT) Copyright © 2016 Jed Watson

[node-img]: https://img.shields.io/node/v/chlu.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/chlu
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/chlu
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/chlu/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/chlu?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/chlu
[downloads-img]: https://img.shields.io/npm/dm/chlu.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/chlu
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/chlu
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/chlu
