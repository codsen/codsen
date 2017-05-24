# easy-replace

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> string replacement with positive and negative lookahead and lookbehind, no regexes

Emphasis on _no regexes_

[![Build Status][travis-img]][travis-url]
[![Coverage Status][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Downloads/Month][downloads-img]][downloads-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Usage](#usage)
- [API](#api)
  - [API - Input](#api---input)
    - [Options object:](#options-object)
  - [API - Output](#api---output)
- [Examples](#examples)
  - ["Maybes" — optional surrounding strings to be replaced as well](#maybes--optional-surrounding-strings-to-be-replaced-as-well)
  - [Negative lookahead - if you want to match something _not followed_ by something else](#negative-lookahead---if-you-want-to-match-something-_not-followed_-by-something-else)
  - [Positive lookbehind - if you want to match something that is _preceded_ by something else](#positive-lookbehind---if-you-want-to-match-something-that-is-_preceded_-by-something-else)
  - [Negative lookbehind* - if you want to match something that is not preceded by something else](#negative-lookbehind---if-you-want-to-match-something-that-is-not-preceded-by-something-else)
  - [Real life scenario](#real-life-scenario)
- [Rationale](#rationale)
- [Testing](#testing)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm install --save easy-replace
```

## Usage

The ideal use case for `easy-replace` is when you need complex lookarounds, such as "replace this only when there is something on the left, but also, if there's some things on the right, include them too, yet there can't be such and such on the right". Yes, you could solve this using a regex, but it's faster to skip regex solutions and simply use this library.

## API

```js
er(source_string, options_object, replacement_string)
```

### API - Input

Input argument       | Type         | Obligatory? | Description
---------------------|--------------|-------------|--------------------
`source_string`      | String       | yes         | Original string
`options_object`     | Plain Object | yes         | Settings
`replacement_string` | String       | no          | Replace all the findings with this. If missing, library runs on _delete-only mode_, it won't replace, just delete.

#### Options object:


Options object's key | Type                    | Obligatory? | Description
---------------------|-------------------------|-------------|--------------------
`{`                  |                         |             |
`leftOutsideNot`     | String/Array of strings | no          | Equivalent of regex negative lookbehind. This/these string(s) must **not be** present to the left of `searchFor` (plus any "maybe's" strings, see below), in order for `searchFor` to be counted as "found". This input's contents are not replaced/deleted.
`leftOutside`        | String/Array of strings | no          | Equivalent of regex positive lookbehind. This/these string(s) must **be** present to the left of `searchFor` (plus any "maybe's" strings, see below), in order for `searchFor` to be counted as "found". This input's contents are not replaced/deleted.
`leftMaybe`          | String/Array            | no          | If this is present on the left side of the `searchFor`, replace/delete it together with `searchFor`, but don't fret if it's not found.
`searchFor`          | String only             | yes         | The keyword to look for in the `source_string`
`rightMaybe`         | String/Array of strings | no          | If this is present on the right side of the `searchFor`, replace/delete it together with `searchFor`, but don't fret if it's not found.
`rightOutside`       | String/Array of strings | no          | Equivalent of regex positive lookahead. This/these string(s) must **be** present to the right of `searchFor` (plus any "maybe's" strings, see higher), in order for `searchFor` to be counted as "found". This input's contents are not replaced/deleted.
`rightOutsideNot`    | String/Array of strings | no          | Equivalent of regex negative lookahead. This/these string(s) must **not be** present to the right of `searchFor` (plus any "maybe's" strings, see higher), in order for `searchFor` to be counted as "found". This input's contents are not replaced/deleted.
`}`                  |                         |             |

### API - Output

Type         | Description
-------------|-----------------------------
String       | String with things replaced

## Examples

*Simple replace:*

* **Example replacement recipe in words** — replace all instances of `x` with `🦄`.

* **Solution using this library:**:

```js
var er = require('easy-replace');

er(
  'a x c x d',
  {
    leftOutsideNot: '',
    leftOutside: '',
    leftMaybe: '',
    searchFor: 'x',
    rightMaybe: '',
    rightOutside: '',
    rightOutsideNot: ''
  },
  '🦄'
);
//=> 'a 🦄 c 🦄 d'
```

---

### "Maybes" — optional surrounding strings to be replaced as well

* **Example replacement recipe in words** — Replace all instances of `i`. If there are `🐴` or `🦄` characters on the left, count them as part of found `i` and replace together as one thing. If there are `🐴` or `🦄` characters on the right, count them as part of found `i` and replace together as one thing.

* **Solution using this library:**:

```js
var er = require('easy-replace');

er(
  '🐴i🦄 🐴i i🦄 i',
  {
    leftOutsideNot: '',
    leftOutside: '',
    leftMaybe: ['🐴', '🦄'],
    searchFor: 'i',
    rightMaybe: ['🐴', '🦄'],
    rightOutside: '',
    rightOutsideNot: ''
  },
  'x'
);
//=> 'x x x x'
```

By the way, notice, how the values can be strings or arrays! The `easy-replace` doesn't accept array only for `searchFor` values — create a loop from the outside of this library, then call this library many times if you want to search for multiple values.

---

### Negative lookahead - if you want to match something _not followed_ by something else

* **Example replacement recipe in words** — Replace all instances of `🦄`, but only ones that don't have `c` or `d` on the right.

* **Solution using this library:**:

```js
var er = require('easy-replace');

er(
  'a🦄c x🦄x',
  {
    leftOutsideNot: '',
    leftOutside: '',
    leftMaybe: '',
    searchFor: '🦄',
    rightMaybe: '',
    rightOutside: '',
    rightOutsideNot: ['c', 'd']
  },
  '🐴'
);
//=> 'a🦄c x🐴x'
```

---

### Positive lookbehind - if you want to match something that is _preceded_ by something else

For example, search for space characters that have another space right to their left, and delete them

* **Example replacement recipe in words** — Replace all occurencies of space character, but only those that have another space character in front of them.

* **Solution using this library:**:

```js
var er = require('easy-replace');

er(
  'zzzzz  zzzzzz zzzzzz',
  {
    leftOutsideNot: '',
    leftOutside: ' ',
    leftMaybe: '',
    searchFor: ' ',
    rightMaybe: '',
    rightOutside: '',
    rightOutsideNot: ''
  },
  ''
);
//=> 'zzzzz zzzzzz zzzzzz'
```

---

### Negative lookbehind* - if you want to match something that is not preceded by something else

For example, our `<br />` sometimes look like `<br/>`. Replace all occurencies of `/>` with `{{space character}}/>` (disregard curly braces, it's only to make it more visible here) if they are not preceded with space already:

* **Example replacement recipe in words** — Add missing spaces before closing slashes on tags. Do not add spaces where they exist already.

* **Solution using this library:**:

```js
var er = require('easy-replace');

er(
  '<br /><br/><br />',
  {
    leftOutsideNot: ' ',
    leftOutside: '',
    leftMaybe: '',
    searchFor: '/>',
    rightMaybe: '',
    rightOutside: '',
    rightOutsideNot: ''
  },
  ' />'
);
//=> '<br /><br /><br />'
```

---

### Real life scenario

* **Example replacement recipe in words** — Add a missing semicolon and/or ampersand on `&nbsp;`, but only where they are missing.

* **Solution using this library:**:

```js
var er = require('easy-replace');

er(
  '&nbsp; nbsp &nbsp nbsp;',
  {
    leftOutsideNot: '',
    leftOutside: '',
    leftMaybe: '&',
    searchFor: 'nbsp',
    rightMaybe: ';',
    rightOutside: '',
    rightOutsideNot: ''
  },
  '&nbsp;'
);
//=> '&nbsp; &nbsp; &nbsp; &nbsp;'
```

## Rationale

Positive lookbehind and negative lookbehind are not supported in native JavaScript (at least in what we count as "classic" JavaScript, not ES2030 or something). Plus I find complex regexes, well, _complex_. Hence this library. I hope it is still simple-enough to bear 'easy' in its name.

Did I mention that this library is [astral-character](https://mathiasbynens.be/notes/javascript-unicode)-friendly? As you noticed in the examples above, it accepts emoji perfectly fine (and AVA tests prove this).

It's impossible to cause an infinite loop on this library (see tests 8.1-8.6).

Library is also friendly if any input is of a `number` type — numbers are converted and replaced string is returned in `string` type (see test 10.8). That's extra convenience.

Options object is fool-proof — you can omit keys or pass non-existing ones or pass non-string type variables — if the options key matches, it's first turned into string. You can even omit any or all of the inputs — library will return an empty string (see tests 9.1–9.6).

Same with replacment — empty, `null`, `boolean` or `undefined` are accepted and interpreted as a request to delete any results found. There's no replacement, only deletion in such case (see tests 10.1–10.7).

## Testing

```bash
$ npm test
```

Unit tests use [AVA](https://github.com/avajs/ava) and [JS Standard](https://standardjs.com) notation.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/easy-replace/issues). If you file a pull request, I'll do my best to help you to get it merged in a timely manner. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email.

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

[travis-img]: https://travis-ci.org/codsen/easy-replace.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/easy-replace

[cov-img]: https://coveralls.io/repos/github/codsen/easy-replace/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/easy-replace?branch=master

[overall-img]: https://www.bithound.io/github/codsen/easy-replace/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/easy-replace

[deps-img]: https://www.bithound.io/github/codsen/easy-replace/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/easy-replace/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/easy-replace/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/easy-replace/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/easy-replace.svg
[downloads-url]: https://www.npmjs.com/package/easy-replace
