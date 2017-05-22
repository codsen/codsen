# check-types-mini

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Check the types of your options object's values after user has customised them

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
- [API](#api)
  - [Options object](#options-object)
- [For example](#for-example)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i -S check-types-mini
```

## Idea

[check-types](https://www.npmjs.com/package/check-types) is good but it's too big. All I need is to `throw` if somebody sets my input settings to a wrong type.

In few occasions, I copied the predecessor function (which later became this library) from one library of mine to another, along with its unit tests. Then I got fed up with that and here were are. Its point is to cut corners publishing new libraries. Every library that has options needs some checks, has user set things to be of a correct type.

## API

**checkTypes(obj, ref\[, msg, optsVarName, opts])**

As a result, it _throws_ `TypeError`s for you, containing your custom message, similar to:

    check-types-mini/checkTypes(): opts.mode was customised to "zzz" which is not Boolean but string

Input argument   | Type         | Obligatory? | Description
-----------------|--------------|-------------|--------------
`obj`            | Plain object | yes         | Options object after user's customisation
`ref`            | Plain object | yes         | Default options — used to compare the types
`msg`            | String       | no          | A message to show. I like to include the name of the calling library, parent function and numeric throw ID.
`optsVarName`    | String       | no          | How is your options variable called? It does not matter much, but it's nicer to keep references consistent with your API documentation.
`opts`           | Plain object | no          | Optional options go here.

### Options object

`options` object's key         | Type     | Obligatory? | Default     | Description
-------------------------------|----------|-------------|-------------|----------------------
{                              |          |             |             |
`ignoreKeys`                   | Array or String | no          | `[]` (empty array)   | Instructs to skip all and any checks on keys, specified in this array. Put them as strings.
`acceptArrays`                 | Boolean  | no          | `false`     | If it's set to `true`, value can be array of elements, same type as reference.
`acceptArraysIgnore`           | Array of strings or String | no | `[]` (empty array) | If you want to ignore `acceptArrays` on certain keys, pass them in an array here.
}                              |          |             |             |

## For example

```js
const checkTypes = require('check-types-mini')
const objectAssign = require('object-assign')
const clone = require('lodash.clonedeep')

function yourFunction (input, opts) {
  // declare defaults, so we can enforce types later:
  var defaults = {
    placeholder: false
  }
  // fill any settings with defaults if missing:
  opts = objectAssign(clone(defaults), opts)
  // the check:
  checkTypes(opts, defaults, 'newLibrary/yourFunction(): [THROW_ID_01]', 'opts')
  // ...
}

var res = yourFunction(1, {placeholder: 'zzz'})

// =>> [TypeError: 'newLibrary/yourFunction(): [THROW_ID_01] opts.placeholder was customised to "false" which is not boolean but string']
```

If you are happy with `opts` variable name, you can omit the fourth argument; it will be set to that by default.

Sometimes you want to accept either a string (or type "X") or an arrays of strings (elements of type "X"). As long as ALL the elements within the array match the reference type, it's OK. For these cases set `opts.acceptArrays` to `true`:

```js
const checkTypes = require('check-types-mini')
var res = checkTypes(
  { // < input
    option1: 'setting1',
    option2: [true, true],
    option3: false
  },
  { // < reference
    option1: 'setting1',
    option2: false,
    option3: false
  }
)
// => Throws, because reference's `option2` is Boolean ("false") but input `option2` is array ("[true, true]").
```

But this does not `throw`:

```js
const checkTypes = require('check-types-mini')
var res = checkTypes(
  {
    option1: 'setting1',
    option2: ['setting3', 'setting4'],
    option3: false
  },
  {
    option1: 'setting1',
    option2: 'setting2',
    option3: false
  },
  'check-types-mini/checkTypes(): [THROW_ID_01]',
  'opts',
  {
    acceptArrays: true
  }
)
// => Does not throw.
```

If you want, you can blacklist certain keys of your objects so that `opts.acceptArrays` will not apply to them. Just add keys into `opts.acceptArraysIgnore` array.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/check-types-mini/issues). If you file a pull request, I'll do my best to help you to get it merged as soon as possible. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

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

[travis-img]: https://travis-ci.org/codsen/check-types-mini.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/check-types-mini

[cov-img]: https://coveralls.io/repos/github/codsen/check-types-mini/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/check-types-mini?branch=master

[bithound-img]: https://www.bithound.io/github/codsen/check-types-mini/badges/score.svg
[bithound-url]: https://www.bithound.io/github/codsen/check-types-mini

[deps-img]: https://www.bithound.io/github/codsen/check-types-mini/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/check-types-mini/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/check-types-mini/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/check-types-mini/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/check-types-mini.svg
[downloads-url]: https://www.npmjs.com/package/check-types-mini
