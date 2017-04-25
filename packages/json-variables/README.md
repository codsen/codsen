# json-variables

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Postprocessor for JSON to allow keys referencing keys

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
    - [inputOriginal](#inputoriginal)
    - [options](#options)
- [Use examples](#use-examples)
  - [Data containers](#data-containers)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i -S json-variables
```

## Idea

Let's make it possible for values within our JSON to reference other keys' values within the same file. This is a simple preprocessor for JSON that does allow this. You can customise how you mark the variables, but the default is: `%%_keyname_%%`:

```js
// IN:
{
  a: 'text %%_b_%% %%_c_%%',
  b: 'something',
  c: 'anything'
}
// OUT:
{
  a: 'text something anything',
  b: 'something',
  c: 'anything'
}
```

The API is the following: a plain object in (it's not mutated), a new plain object out.

## API

**jsonVariables (inputOriginal, options)**

Returns a plain object with all variables resolved.

#### inputOriginal

Type: `object` - a plain object. Usually parsed JSON file.

#### options

Type: `object` - an optional options object. (PS. Nice accidental rhyming)

**Defaults**:

    {
      heads: '%%_',
      tails: '_%%',
      lookForDataContainers: true,
      dataContainerIdentifierTails: '_data',
      wrapHeads: '',
      wrapTails: '',
      dontWrapVars: [],
      preventDoubleWrapping: true,
      wrapGlobalFlipSwitch: true
    }

`options` object's key         | Type     | Obligatory? | Default     | Description
-------------------------------|----------|-------------|-------------|----------------------
{                              |          |             |             |
`heads`                        | String   | no          | `%%_`       | How do you want to mark the beginning of a variable?
`tails`                        | String   | no          | `_%%`       | How do you want to mark the ending of a variable?
`lookForDataContainers`        | Boolean  | no          | `true`      | You can put a separate dedicated key, named similarly, where the values for variables are placed.
`dataContainerIdentifierTails` | String   | no          | `_data`     | If you do put your variables in dedicated keys besides, those keys will have to be different somehow. We suggest appending a string to the key's name — tell here what string.
`wrapHeads`                    | String   | no          | n/a         | We can optionally wrap each resolved string with a string. One to the left is called "heads", please tell what string to use.
`wrapTails`                    | String   | no          | n/a         | We can optionally wrap each resolved string with a string. One to the right is called "tails", please tell what string to use.
`dontWrapVars`                 | Array of strings OR String | no          | n/a         | If any of the variables (surrounded by `heads` and `tails`) can be matched by string(s) given here, it won't be wrapped with `wrapHeads` and `wrapTails`. You can put **wildcards** (*) to note zero or more characters.
`preventDoubleWrapping`        | Boolean  | no          | `true`      | If you use `wrapHeads` and `wrapTails`, we can make sure the existing string does not contain these already. It's to prevent double/triple/multiple wrapping.
`wrapGlobalFlipSwitch`         | Boolean  | no          | `true`      | Global flipswitch to turn off the variable wrapping function completely, everywhere.
`noSingleMarkers`              | Boolean  | no          | `false`     | Key values can be equal to `heads` or `tails`. If you don't want that, set it to `true`, the library will throw an error on those cases.
}                              |          |             |             |

## Use examples

If you don't care how to mark the variables, use my notation: `%%_` to mark a beginning of a variable (heads) and `_%%` to mark ending (tails).

Check this:

```js
const jv = require('json-variables')
var res = jv(
  {
    a: 'some text %%_var1_%% more text %%_var2_%%',
    b: 'something',
    var1: 'value1',
    var2: 'value2'
  }
)
console.log('res = ' + JSON.stringify(res, null, 4))
// ==> {
//       a: 'some text value1 more text value2',
//       b: 'something',
//       var1: 'value1',
//       var2: 'value2'
//     }
```

You can declare your way to mark variables, your own _heads_ and _tails_. For example, `{` and `}`:

```js
const jv = require('json-variables')
var res = jv(
  {
    a: 'some text {var1} more text {var2}',
    b: 'something',
    var1: 'value1',
    var2: 'value2'
  },
  {
    heads: '{', tails: '}'
  }
)
console.log('res = ' + JSON.stringify(res, null, 4))
// => {
//      a: 'some text value1 more text value2',
//      b: 'something',
//      var1: 'value1',
//      var2: 'value2'
//    }
```

You can also wrap all resolved variables with strings, a new heads and tails using `opts.wrapHeads` and `opts.wrapTails`. For example, make them Java-style, wrapped with `${` and `}`:

```js
const jv = require('json-variables')
var res = jv(
  {
    a: 'some text %%_var1_%% more text %%_var2_%%',
    b: 'something',
    var1: 'value1',
    var2: 'value2'
  },
  {
    wrapHeads: '${',
    wrapTails: '}'
  }
)
console.log('res = ' + JSON.stringify(res, null, 4))
// => {
//      a: 'some text ${value1} more text ${value2}',
//      b: 'something',
//      var1: 'value1',
//      var2: 'value2'
//    }
```

If variables reference keys which values reference other keys that are fine. Just ensure there's no closed loop.

```js
const jv = require('json-variables')
var res = jv({
  a: '%%_b_%%',
  b: '%%_c_%%',
  c: '%%_d_%%',
  d: '%%_e_%%',
  e: '%%_b_%%'
})
console.log('res = ' + JSON.stringify(res, null, 4))
// THROWS because "e" loops to "b" forming a infinite loop.
```

### Data containers

Data-wise, if you looked at a higher level, it might appear clunky to put values as separate values, like in examples above. Saving you time scrolling, check this out:

```js
{
  a: 'some text %%_var1_%% more text %%_var2_%%',
  b: 'something',
  var1: 'value1',
  var2: 'value2'
}
```

Does this look like clean data arrangement? Hell no. This is a convoluted and nasty data. The keys `var1` and `var2` are not of the same status as `a` and `b`, therefore can't be mashed together at the same level.

What if we placed all key's `a` variables within a separate key, `a_data` — it starts with the same letter so it will end up being nearby the `a` after sorting. Observe:

```js
{
  a: 'some text %%_var1_%% more text %%_var2_%%',
  a_data: {
    var1: 'value1',
    var2: 'value2'
  },
  b: 'something'
}
```

That's better, isn't it? I think so too.

To set this up, you can either rely on my default way of naming data keys, appending `_data`, or you can customise that using `opts.dataContainerIdentifierTails`. On the other hand, you can also turn off this function completely via `opts.lookForDataContainers`.

```js
const jv = require('json-variables')
var res = jv(
  {
    a: 'some text %%_var1_%% more text %%_var3_%%.',
    a_data: {
      var1: 'value1',
      var3: '333333'
    },
    b: 'something'
  }
)
console.log('res = ' + JSON.stringify(res, null, 4))
// => {
//      a: 'some text value1 more text 333333.',
//      b: 'something',
//      a_data: {
//        var1: 'value1',
//        var3: '333333'
//      }
//    }
```

### Ignores with wildcards

You can ignore the wrapping on any keys by supplying their name patterns in the options array, `dontWrapVars` value. It can be array or string:

```js
const jv = require('json-variables')
var res = jv(
  {
    a: '%%_b_%%',
    b: '%%_c_%%',
    c: 'val'
  },
  {
    wrapHeads: '{',
    wrapTails: '}',
    dontWrapVars: ['b*', 'c*']
  }
)
console.log('res = ' + JSON.stringify(res, null, 4))
// => {
//      a: 'val', <<< didn't get wrapped
//      b: 'val', <<< also didn't get wrapped
//      c: 'val'
//    }
```

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://github.com/feross/standard) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/code-and-send/json-variables/issues). If you file a pull request, I'll do my best to help you to get it merged as soon as possible. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

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

[travis-img]: https://travis-ci.org/code-and-send/json-variables.svg?branch=master
[travis-url]: https://travis-ci.org/code-and-send/json-variables

[cov-img]: https://coveralls.io/repos/github/code-and-send/json-variables/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/code-and-send/json-variables?branch=master

[bithound-img]: https://www.bithound.io/github/code-and-send/json-variables/badges/score.svg
[bithound-url]: https://www.bithound.io/github/code-and-send/json-variables

[deps-img]: https://www.bithound.io/github/code-and-send/json-variables/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/code-and-send/json-variables/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/code-and-send/json-variables/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/code-and-send/json-variables/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/json-variables.svg
[downloads-url]: https://www.npmjs.com/package/json-variables
