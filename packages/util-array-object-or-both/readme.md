# util-array-object-or-both

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Validate and normalise user choice: array, object or both?

[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Coverage Status][cov-img]][cov-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Test in browser][runkit-img]][runkit-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Purpose](#purpose)
- [API](#api)
- [Use](#use)
- [Critique](#critique)
- [Testing](#testing)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm install --save util-array-object-or-both
```

## Purpose

When I give the user ability to choose their preference out of: `array`, `object` or `any`, I want to:

- Allow users to input the preference in many ways: for example, for `array`, I also want to accept: `Arrays`, `add`, `ARR`, `a`. Similar thing goes for options `object` and `any`.
- Normalise the choice - recognise it and set it to one of the three following strings: `array`, `object` or `any`. This is necessary because we want set values to use in our programs. You can't have five values for `array` in an IF statement, for example.
- When a user sets the preference to unrecognised string, I want to `throw` a meaningful error message. Technically this will be achieved using an options object.
- Enforce lowercase and trim and input, to maximise the input possibilities

<br>        | Assumed to be an array-type | object-type   | either type
------------|------------|---------------|---------------
**Input string:**  | `array`    | `object`      | `any`
<br>        | `arrays`   | `objects`     | `all`
<br>        | `arr`      | `obj`         | `everything`
<br>        | `aray`     | `ob`          | `both`
<br>        | `arr`      | `o`           | `either`
<br>        | `a`        |               | `each`
<br>        |            |               | `whatever`
<br>        |            |               | `e`
<br>        | `----`     | `----`        | `----`
**Output string:** | `array`    | `object`      | `any`

## API

API is simple - just pass your value through this library's function. If it's valid, it will be normalised to either `array` or `object` or `any`. If it's not valid, an error will be thrown.

Input argument   | Type         | Obligatory? | Description
-----------------|--------------|-------------|-------------
`input`          | String       | yes         | Let users choose from variations of "array", "object" or "both". See above.
`opts`           | Plain object | no          | Optional Options Object. See below for its API.

Options object lets you customise the `throw`n error message. It's format is the following:

    ${opts.msg}The ${opts.optsVarName} was customised to an unrecognised value: ${str}. Please check it against the API documentation.

`options` object's key | Type     | Obligatory? | Default          | Description
-----------------------|----------|-------------|------------------|----------------------
{                      |          |             |                  |
`msg`                  | String   | no          | ``               | Append the message in front of the thrown error.
`optsVarName`          | String   | no          | `given variable` | The name of the variable we are checking here.
}                      |          |             |                  |

For example, set `optsVarName` to `opts.only` and set `msg` to `posthtml-ast-delete-key/deleteKey(): [THROW_ID_01]` and the error message `throw`n if user misconfigures the setting will be, for example:

    posthtml-ast-delete-key/deleteKey(): [THROW_ID_01] The variable "opts.only" was customised to an unrecognised value: sweetcarrots. Please check it against the API documentation.

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
  // now you want to check your options object, is it still valid after users have laid their sticky paws on it:
  // define defaults:
  let defaults = {
    lalala: null,
    only: 'object' // <<< this is the value we're particularly keen to validate, is it `array`|`object`|`any`
  }
  // clone the defaults to safeguard it, and then, object-assign onto defaults.
  // basically you fill missing values with default-ones
  opts = objectAssign(clone(defaults), opts)
  // now, use "check-types-mini" to validate the types:
  checkTypes(opts, defaults,
    {
      // give a meaningful message in case it throws,
      // customise the library `check-types-mini`:
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
  opts.only = arrayOrObjectOrBoth(opts.only, {
    msg: 'my-library/myPrecious(): [THROW_ID_02]',
    optsVarName: 'opts.only'
  })
  // now we can guarantee that it's either falsey (undefined or null) OR:
  //   - `object`
  //   - `array`
  //   - `any`

  // now you can use `opts.only` in your function safely.
  ...
  // rest of the function...
}
```

## Critique

You may ask, why on Earth you would need a package for such thing? It's not very universal to be useful for society, is it?

Actually, it is.

I discovered that when working with AST's, you often need to tell your tools to process (traverse, delete, and so on) EITHER objects OR arrays or both. That's where this library comes in: standardise the choice out of three options and give a user a wide amount of values to use.

I think the API should accept a very wide spectrum of values, so users would not even need to check the API documentation - they'd just describe what they want, in plain English.

I'm going to use it in:
- [ast-monkey](https://github.com/codsen/ast-monkey)
- [json-variables](https://github.com/codsen/json-variables)
- [posthtml-ast-delete-key](https://github.com/codsen/posthtml-ast-delete-key)

and others. So, it's not that niche as it might seem!

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

[npm-img]: https://img.shields.io/npm/v/util-array-object-or-both.svg
[npm-url]: https://www.npmjs.com/package/util-array-object-or-both

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

[vulnerabilities-img]: https://snyk.io/test/github/codsen/util-array-object-or-both/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/util-array-object-or-both

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg
[deps2d-url]: http://npm.anvaka.com/#/view/2d/util-array-object-or-both

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-ff9900.svg
[runkit-url]: https://npm.runkit.com/util-array-object-or-both
