# util-nonempty

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Is the input (plain object, array, string or whatever) not empty?

[![Build Status][travis-img]][travis-url]
[![Coverage Status][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Downloads/Month][downloads-img]][downloads-url]

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
  input // Array, plain object or string will be checked, rest will be instantly "false", unless input's missing (then returns undefined)
);
// => Boolean|undefined
```

## Testing

```bash
$ npm test
```

Unit tests use [AVA](https://github.com/avajs/ava) and [JS Standard](https://github.com/feross/standard) notation. I aim to have 100% unit test coverage.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://github.com/feross/standard) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/code-and-send/util-nonempty/issues). If you file a pull request, I'll do my best to help you to get it merged in a timely manner. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email.

## Licence

> MIT License (MIT)

> Copyright (c) 2016 Code and Send Ltd, Roy Reveltas

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

[travis-img]: https://travis-ci.org/code-and-send/util-nonempty.svg?branch=master
[travis-url]: https://travis-ci.org/code-and-send/util-nonempty

[cov-img]: https://coveralls.io/repos/github/code-and-send/util-nonempty/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/code-and-send/util-nonempty?branch=master

[overall-img]: https://www.bithound.io/github/code-and-send/util-nonempty/badges/score.svg
[overall-url]: https://www.bithound.io/github/code-and-send/util-nonempty

[deps-img]: https://www.bithound.io/github/code-and-send/util-nonempty/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/code-and-send/util-nonempty/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/code-and-send/util-nonempty/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/code-and-send/util-nonempty/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/util-nonempty.svg
[downloads-url]: https://www.npmjs.com/package/util-nonempty
