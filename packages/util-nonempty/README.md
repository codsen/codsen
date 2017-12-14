# util-nonempty

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Is the input (plain object, array, string or whatever) not empty?

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
- [Purpose](#purpose)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i util-nonempty
```

```js
// consume as a CommonJS require:
const nonEmpty = require('util-nonempty')
// or as ES module:
import nonEmpty from 'util-nonempty'

// then call as a function, pass it anything:
console.log(nonEmpty('a'))
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled, contains `require` and `module.exports` | `main`                | `dist/util-nonempty.cjs.js` | 757&nbsp;B
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/util-nonempty.esm.js` | 604&nbsp;B
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/util-nonempty.umd.js` | 904&nbsp;B

**[⬆ &nbsp;back to top](#)**

## Purpose

I want a quick utility function, to be able to detect is the input not empty.

```js
nonEmpty('z')
// => true

nonEmpty('')
// => false

nonEmpty(['a'])
// => true

nonEmpty([123])
// => true

nonEmpty([[[[[[[[[[[]]]]]]]]]]])
// => false

nonEmpty({a: 'a'})
// => true

nonEmpty({})
// => false

var f = function () { return 'z' }
nonEmpty(f)
// => false (answer is instantly false if input is not array, plain object or string)
```

If you want to check _non-emptiness_ of complex nested trees of objects, arrays and strings (like parsed HTML [AST](https://github.com/posthtml/posthtml-parser)), you need a library which can recursively traverse that. There are two options:

* If you want to check for strict emptiness, that is `[]` or `{}` is empty, but `{aaa: '   \n\n\n   ', '   \t'}` is not, see [posthtml-ast-is-empty](https://www.npmjs.com/package/posthtml-ast-is-empty)
* If your "emptiness" definition is wider — anything (plain object, array or string or a mix of thereof) that contains only whitespace (spaces, line breaks, tabs and so on), see [posthtml-ast-contains-only-empty-space](https://www.npmjs.com/package/posthtml-ast-contains-only-empty-space).

**[⬆ &nbsp;back to top](#)**

## API

Anything-in, Boolean-out.

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/util-nonempty/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/util-nonempty/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give an advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/util-nonempty/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/util-nonempty.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/util-nonempty

[npm-img]: https://img.shields.io/npm/v/util-nonempty.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/util-nonempty

[travis-img]: https://img.shields.io/travis/codsen/util-nonempty.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/util-nonempty

[cov-img]: https://coveralls.io/repos/github/codsen/util-nonempty/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/util-nonempty?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/util-nonempty.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/util-nonempty

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/util-nonempty.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/util-nonempty/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/util-nonempty

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/util-nonempty.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/util-nonempty/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/util-nonempty/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/util-nonempty

[downloads-img]: https://img.shields.io/npm/dm/util-nonempty.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/util-nonempty

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/util-nonempty

[license-img]: https://img.shields.io/npm/l/util-nonempty.svg?style=flat-square
[license-url]: https://github.com/codsen/util-nonempty/blob/master/license.md
