# util-array-object-or-both

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Is the input (plain object, array, string or whatever) not empty?

[![Build Status][travis-img]][travis-url]
[![Coverage Status][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Downloads/Month][downloads-img]][downloads-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Purpose](#purpose)
- [Install](#install)
- [Use](#use)
- [Critique](#critique)
- [API](#api)
- [Testing](#testing)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Purpose

When I give the user ability to choose from: `array`, `object` or `both` in settings, I want to:

- validate the choice, `throw`ing an error if it's not among the acceptable values
- allow user to state the choice in a multiple ways: `array`, `Arrays`, `add`, `ARR`, `a` - all will be normalised to `array`. That's what this library will return.
- forcing lowercase and trimming are done on all input by default

## Install

```bash
$ npm install --save util-array-object-or-both
```

## Use

```js
// require this library:
const arrayOrObjectOrBoth = require('util-array-object-or-both')
// and friends:
const clone = require('lodash.clonedeep')
const checkTypes = require('check-types-mini')
const objectAssign = require('object-assign')
// let's say you have a function:
function myPrecious (input, opts) {
  // blablabla
}
// now you want to check your options object, is it valid etc:
// define defaults:
let defaults = {
  lalala: null,
  only: 'object' // <<< this is the value we're interested.
}
// clone the defaults to safeguard it, and then, object-assign onto defaults.
// basically you fill missing values with default-ones
opts = objectAssign(clone(defaults), opts)
// now, use "check-types-mini" to validate the types:
checkTypes(opts, defaults,
  {
    // give a meaningful message in case it throws:
    msg: 'my-library/myPrecious(): [THROW_ID_01]',
    optsVarName: 'opts',
    schema: {
      lalala: ['null', 'string'],
      only: ['null', 'string']
    }
  }
)
// by this point, we can guarantee that opts.only is either `null` or `string`.
// if it's a `string`, let's validate is its values among accepted-ones:
opts.only = arrayOrObjectOrBoth(opts.only)
// now we can guarantee that it's either falsey (undefined or null) OR:
//   - `object`
//   - `array`
//   - `any`

// now you can use `opts.only`
```

## Critique

You may ask, why on Earth you would need a package for such thing? It's not very universal to be useful for society, is it?

Actually, it is.

I discovered that when working with AST's, you often need to tell your tools to process (traverse, delete, and so on) EITHER objects OR arrays, or both. That's where this library comes in: standardise the choice out of three options and give user a wide amount of values to use.

I think the API should accept very wide amount of values so you don't even need to check the API documentation - just describe that in English.

I'm going to use it in:
- [ast-monkey](https://github.com/codsen/ast-monkey)
- [json-variables](https://github.com/codsen/json-variables)
- [posthtml-ast-delete-key](https://github.com/codsen/posthtml-ast-delete-key)

and others. So, it's not that niche as it might seem!

## API

API is simple - just pass your value through this library's function. If it's valid, it will be normalised to either `array` or `object` or `any`. If it's not valid, error will be thrown.

Input argument   | Type   | Obligatory? | Description
-----------------|--------|-------------|-------------
`input`          | String | yes         | Let users choose from variations of "array", "object" or "both". See below.

Accepted values for:

Input:  | Array-type | Object-type   | Either type
--------|------------|---------------|---------------
        | `array`    | `object`      | `any`
        | `arrays`   | `objects`     | `all`
        | `arr`      | `obj`         | `everything`
        | `aray`     | `ob`          | `both`
        | `arr`      | `o`           | `either`
        | `a`        |               | `each`
        |            |               | `whatever`
        |            |               | `e`
--------|------------|---------------|---------------
Output: | `array`    | `object`      | `any`

## Testing

```bash
$ npm test
```

Unit tests use [AVA](https://github.com/avajs/ava) and [JS Standard](https://standardjs.com) notation. I aim to have 100% unit test coverage (both _line_ and _branch_).

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/util-array-object-or-both/issues). If you feel you could advise how to code something better, do email me. I know it never happens, but I appreciate when people teach me new things.

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

[travis-img]: https://travis-ci.org/codsen/util-array-object-or-both.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/util-array-object-or-both

[cov-img]: https://coveralls.io/repos/github/codsen/util-array-object-or-both/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/util-array-object-or-both?branch=master

[overall-img]: https://www.bithound.io/github/codsen/util-array-object-or-both/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/util-array-object-or-both

[deps-img]: https://www.bithound.io/github/codsen/util-array-object-or-both/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/util-array-object-or-both/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/util-array-object-or-both/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/util-array-object-or-both/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/util-array-object-or-both.svg
[downloads-url]: https://www.npmjs.com/package/util-array-object-or-both
