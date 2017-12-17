# Chlu

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> CH-ange-L-og U-pdate - Automatically fix errors in your changelog file

[![Minimum Node version required][node-img]][node-url]
[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![Coverage][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![MIT License][license-img]][license-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [What it does](#what-it-does)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
npm i chlu
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled, contains `require` and `module.exports` | `main`                | `dist/chlu.cjs.js` | 17&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/chlu.esm.js` | 16&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/chlu.umd.js` | 139&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## What it does

`chlu` stands for CHangeLog Update. This library is the API for [`chlu-cli`](https://github.com/codsen/chlu-cli) which you should install with a `-g` flag. You probably should check it [instead](https://github.com/codsen/chlu-cli).

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/chlu/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/chlu/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give an advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/chlu/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/chlu.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/chlu

[npm-img]: https://img.shields.io/npm/v/chlu.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/chlu

[travis-img]: https://img.shields.io/travis/codsen/chlu.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/chlu

[cov-img]: https://coveralls.io/repos/github/codsen/chlu/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/chlu?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/chlu.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/chlu

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/chlu.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/chlu/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/chlu

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/chlu.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/chlu/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/chlu/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/chlu

[downloads-img]: https://img.shields.io/npm/dm/chlu.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/chlu

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/chlu

[license-img]: https://img.shields.io/npm/l/chlu.svg?style=flat-square
[license-url]: https://github.com/codsen/chlu/blob/master/license.md
