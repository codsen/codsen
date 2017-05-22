# arrayiffy-if-string

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Put non-empty strings into arrays, empty-ones into empty arrays. Bypass everything else.

[![Build Status][travis-img]][travis-url]
[![Coverage Status][cov-img]][cov-url]
[![bitHound Score][bithound-img]][bithound-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Downloads/Month][downloads-img]][downloads-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Idea](#idea)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i -S arrayiffy-if-string
```

## Idea

- If it's a non-empty string, put it into an array and return it.
- If it's empty string, return an empty array.
- If it's anything else, just return it.

```js
const arrayiffy = require('arrayiffy-if-string')
var res = arrayiffy('aaa')
console.log('res = ' + JSON.stringify(res, null, 4))
// => ['aaa']
```

```js
const arrayiffy = require('arrayiffy-if-string')
var res = arrayiffy('')
console.log('res = ' + JSON.stringify(res, null, 4))
// => []
```

```js
const arrayiffy = require('arrayiffy-if-string')
var res = arrayiffy(true)
console.log('res = ' + JSON.stringify(res, null, 4))
// => true
```

It's meant for working with settings objects. Check out [check-types-mini](https://github.com/codsen/check-types-mini).

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/arrayiffy-if-string/issues). If you file a pull request, I'll do my best to help you to get it merged as soon as possible. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

## Licence

> MIT License (MIT)

> Copyright (c) 2017 Codsen Ltd, Roy Reveltas

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

[travis-img]: https://travis-ci.org/codsen/arrayiffy-if-string.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/arrayiffy-if-string

[cov-img]: https://coveralls.io/repos/github/codsen/arrayiffy-if-string/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/arrayiffy-if-string?branch=master

[bithound-img]: https://www.bithound.io/github/codsen/arrayiffy-if-string/badges/score.svg
[bithound-url]: https://www.bithound.io/github/codsen/arrayiffy-if-string

[deps-img]: https://www.bithound.io/github/codsen/arrayiffy-if-string/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/arrayiffy-if-string/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/arrayiffy-if-string/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/arrayiffy-if-string/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/arrayiffy-if-string.svg
[downloads-url]: https://www.npmjs.com/package/arrayiffy-if-string
