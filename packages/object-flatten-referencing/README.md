# object-flatten-referencing

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Flatten complex nested objects according to a reference

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
- [Usage](#usage)
- [API](#api)
    - [plainObject](#plainobject)
    - [searchValue](#searchvalue)
    - [options](#options)
- [The algorithm](#the-algorithm)
- [In practice](#in-practice)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i -S object-flatten-referencing
```

## Idea

Sometimes you need to make one nested object to look like another, type-wise.

You've got:

```js
{
  a: [
    {
      b: 'c',
      d: 'e'
    }
  ]
}
```

but, for example, you need to make it like:

```js
{
  a: 'b.c<br />d.e'
}
```

This library does that.

## Usage

```js
const ofr = require('object-flatten-referencing')
var res = ofr(plainObject, referenceObject, options)
console.log('res = ' + JSON.stringify(res, null, 4))
```

## API

**ofr(plainObject, referenceObject\[, options])**

Returns a plain object, flattened according to your supplied reference object.

#### plainObject

Type: `object` (plain object)
Obligatory: `yes`

First input argument — the object which you want to flatten.

#### searchValue

Type: `object` (plain object)
Obligatory: `yes`

A reference object — according to what you want to flatten the `plainObject`.

#### options

Type: `object` (plain object)
Obligatory: `no`

An optional third argument - options object.

```js
{
  wrapHeads: '%%_',
  wrapTails: '_%%',
  dontWrapKeysStartingWith: [],
  dontWrapKeysEndingWith: [],
  xhtml: true,
  preventDoubleWrapping: true,
  objectKeyAndValueJoinChar: '.',
  wrapGlobalFlipSwitch: true,
  ignore: []
}
```

`options` object's key         | Type     | Obligatory? | Default           | Description
-------------------------------|----------|-------------|-------------------|----------------------
{                              |          |             |                   |
`wrapHeads`                    | String   | no          | `%%_`             | Prepend this to each value, each result of flattening or simply other encountered value.
`wrapTails`                    | String   | no          | `_%%`             | Append this to each value, each result of flattening or simply other encountered value.
`dontWrapKeysStartingWith`     | Array or String | no          | empty array      | If it's set, if key names start with this, then we won't append or prepend anything to them (or their child nodes). Also, we won't flatten them (or their child nodes). This is used to prevent mangling of keys containing your [data storage](https://github.com/code-and-send/json-variables#data-containers), for example.
`dontWrapKeysEndingWith`         | Array or String | no | empty array      | If it's set, if key names end with this, then we won't append or prepend anything to them (or their child nodes). Also, we won't flatten them (or their child nodes). This is used to prevent mangling of keys containing your [data storage](https://github.com/code-and-send/json-variables#data-containers), for example.
`xhtml`                        | Boolean  | no          | `true`            | When flattening, arrays or plain objects are converted into strings. Each value is separated by a line break, and this controls which type to use: HTML (`<br>`) or XHTML (`<br />`)
`preventDoubleWrapping`        | Boolean  | no          | `true`            | If the current value already contains a string from `wrapHeads` or `wrapTails`, don't wrap to prevent double wrapping.
`objectKeyAndValueJoinChar`    | String   | no          | `.`               | When an object is turned into a string, its key is joined with its value, with another string in-between. This controls what that in-between string is.
`wrapGlobalFlipSwitch`         | Boolean  | no          | `true`            | You can turn off the wrapping function completely using this.
`ignore`                       | Array or String | no   | empty array       | Don't apply any flattening to any of these keys. Naturally, don't wrap them with anything either.
`whatToDoWhenReferenceIsMissing` | Integer | no         | `0`               | 0 = skip, 1 = throw, 2 = flatten to string
}                              |          |             |                   |

## The algorithm

In its core, this library uses two functions:

- one which flattens objects
- another which flattens arrays

**Objects** are flattened into arrays (yes, not strings) in the following fashion:

```js
// from:
{
  a: 'b',
  c: 'd'
}
// to:
['%%_a.b_%%', '%%_c.d_%%']
```

Arrays are flattened into strings:

```js
// from:
['a', 'b', 'c']
// to:
'%%_a_%%<br />%%_b_%%<br />%%_c_%%'
```

This library recursively traverses both inputs, compares their types and if one type is lesser in the food chain (object vs. string), it uses the above functions to flatten all mismatching elements into strings.

## In practice

In practice, you will need this library when you need to map the variables in email templates.

For example, your _data content file_ in JSON (development version) that controls your template is:

```js
// data file:
{
  "title": "Welcome",
  "name": "John"
}
```

but you need to turn it into the following when generating PROD version:

```js
// you want your data file to look like this after processing:
{
  "title": "Welcome",
  "name": "${object.name}"
}
```

To achieve that, you use another JSON _mapping file_,

```js
// mapping file:
{
  "name": {
    "object": "name"
  }
}
```

It's easy to merge the _mapping file_ onto the _data file_, but you get:

```js
// intermediate data file after merging the mapping file over data file
{
  "title": "Welcome",
  "name": {
    "object": "name"
  }
}
```

Now you need to **flatten** the above object, so that the key called `name` has a value of `string` type, not `object`. This library helps to achieve that:

```js
var mergedDataFile = {
  "title": "Welcome",
  "name": {
    "object": "name"
  }
}
var reference = {
  "title": "Welcome",
  "name": "John"
}
mergedDataFile = ofr(
  mergedDataFile,
  reference,
  {
    wrapHeads: '${',
    wrapTails: '}'
  }
)
console.log(JSON.stringify(mergedDataFile, null, 4))
// => {
//      "title": "Welcome",
//      "name": "${object.name}"
//    }
```

Voilà!

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://github.com/feross/standard) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/code-and-send/object-flatten-referencing/issues). If you file a pull request, I'll do my best to help you to get it merged as soon as possible. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

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

[travis-img]: https://travis-ci.org/code-and-send/object-flatten-referencing.svg?branch=master
[travis-url]: https://travis-ci.org/code-and-send/object-flatten-referencing

[cov-img]: https://coveralls.io/repos/github/code-and-send/object-flatten-referencing/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/code-and-send/object-flatten-referencing?branch=master

[bithound-img]: https://www.bithound.io/github/code-and-send/object-flatten-referencing/badges/score.svg
[bithound-url]: https://www.bithound.io/github/code-and-send/object-flatten-referencing

[deps-img]: https://www.bithound.io/github/code-and-send/object-flatten-referencing/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/code-and-send/object-flatten-referencing/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/code-and-send/object-flatten-referencing/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/code-and-send/object-flatten-referencing/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/object-flatten-referencing.svg
[downloads-url]: https://www.npmjs.com/package/object-flatten-referencing
