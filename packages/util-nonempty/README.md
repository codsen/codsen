# util-nonempty

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Is the input (plain object, array, string or whatever) not empty?

[![Build Status][travis-img]][travis-url]
[![Coverage Status][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Purpose](#purpose)
- [Install](#install)
- [Use](#use)
- [API](#api)
- [Testing](#testing)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Purpose

I want a quick utility function, to be able to detect is the input not empty.

```js
nonEmpty('z')
// => true

nonEmpty('')
// => false

nonEmpty(['a'])
// => true

nonEmpty([])
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

## Install

```bash
$ npm install --save util-nonempty
```

## Use

```js
var nonEmpty = require('util-nonempty')
console.log(nonEmpty('a'))
```

## API

```js
nonEmpty (
  input // Array, plain object or string will be checked, rest will be instantly "false", unless input's missing (then returns undefined).
);
// => Boolean|undefined
```

## Testing

```bash
$ npm test
```

Unit tests use [AVA](https://github.com/avajs/ava) and [JS Standard](https://standardjs.com) notation. I aim to have 100% unit test coverage.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/util-nonempty/issues). If you file a pull request, I'll do my best to help you to get it merged in a timely manner. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email.

## Licence

> MIT License (MIT)

> Copyright (c) 2017 Codsen Ltd, Roy Revelt

> Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[travis-img]: https://travis-ci.org/codsen/util-nonempty.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/util-nonempty

[cov-img]: https://coveralls.io/repos/github/codsen/util-nonempty/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/util-nonempty?branch=master

[overall-img]: https://www.bithound.io/github/codsen/util-nonempty/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/util-nonempty

[deps-img]: https://www.bithound.io/github/codsen/util-nonempty/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/util-nonempty/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/util-nonempty/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/util-nonempty/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/util-nonempty.svg
[downloads-url]: https://www.npmjs.com/package/util-nonempty

[vulnerabilities-img]: https://snyk.io/test/github/codsen/util-nonempty/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/util-nonempty
