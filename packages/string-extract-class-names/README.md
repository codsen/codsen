# string-extract-class-names

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Extract class (or id) name from a string

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

## Install

```sh
npm i string-extract-class-names
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/string-extract-class-names.cjs.js` | 2&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/string-extract-class-names.esm.js` | 2&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/string-extract-class-names.umd.js` | 8&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Purpose](#purpose)
- [Examples](#examples)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Purpose

This library extracts the class and id names from the string and returns them all put into an array.

I use `string-extract-class-names` to identify all the CSS class names from the parsed HTML/CSS in the library [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css) which detects and deletes the unused CSS styles.

Since deleting of people's code is a risky task, a huge responsibility falls onto parts which identify _what should be deleted_, and more importantly, parts which identify _class names and id's_. That's why I extracted the `string-extract-class-names` from the `email-remove-unused-css` and set up a proper test suite.

Currently there 196 checks in `test.js` running on [AVA](https://github.com/avajs/ava). I'm checking all the possible (and impossible) strings in and around the class and id names to be 100% sure **only** correct class and id names are put into the results array and nothing else.

**[⬆ &nbsp;back to top](#)**

## Examples

```js
var extract = require('string-extract-class-names')

// two classes and one id extracted:
extract('div.first.second#third a[target=_blank]')
// => ['.first', '.second', '#third']

// six id's extracted (works even despite the nonsensical question mark characters):
extract('?#id1#id2? #id3#id4> p > #id5#id6')
// => ['#id1', '#id2', '#id3', '#id4', '#id5', '#id6']
```

**[⬆ &nbsp;back to top](#)**

## API

```js
extract(
  string               // String. Input.
)
// => Extracted classes/id's in an array
```

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/string-extract-class-names/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/string-extract-class-names/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/string-extract-class-names/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-extract-class-names.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-extract-class-names

[npm-img]: https://img.shields.io/npm/v/string-extract-class-names.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/string-extract-class-names

[travis-img]: https://img.shields.io/travis/codsen/string-extract-class-names.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/string-extract-class-names

[cov-img]: https://coveralls.io/repos/github/codsen/string-extract-class-names/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-extract-class-names?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/string-extract-class-names.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/string-extract-class-names

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/string-extract-class-names.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/string-extract-class-names/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-extract-class-names

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/string-extract-class-names.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/string-extract-class-names/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-extract-class-names/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-extract-class-names

[downloads-img]: https://img.shields.io/npm/dm/string-extract-class-names.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-extract-class-names

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-extract-class-names

[license-img]: https://img.shields.io/npm/l/string-extract-class-names.svg?style=flat-square
[license-url]: https://github.com/codsen/string-extract-class-names/blob/master/license.md
