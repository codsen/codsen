# easy-replace

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> string replacement with positive and negative lookahead and lookbehind, no regexes

Emphasis on _no regexes_

[![Build Status](https://travis-ci.org/revelt/easy-replace.svg?branch=master)](https://travis-ci.org/revelt/easy-replace) [![bitHound Overall Score](https://www.bithound.io/github/revelt/easy-replace/badges/score.svg)](https://www.bithound.io/github/revelt/easy-replace) [![Dependency Status](https://david-dm.org/revelt/easy-replace.svg)](https://david-dm.org/revelt/easy-replace) [![devDependency Status](https://david-dm.org/revelt/easy-replace/dev-status.svg)](https://david-dm.org/revelt/easy-replace#info=devDependencies) [![Downloads/Month](https://img.shields.io/npm/dm/easy-replace.svg)](https://www.npmjs.com/package/easy-replace)

## Install

```bash
$ npm install --save easy-replace
```

## Test

```
$ npm test
```

## Usage

The ideal use case for `easy-replace` is when you need complex lookarounds, such as "replace this only when there is something on the left, but also, if there's some things on the right, include them too, yet there can't be such and such on the right". Yes, you could solve this using a regex, but it's faster to skip regex solutions and simply use this library.

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

*"Maybes"* — optional surrounding strings to be replaced as well:

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

*Negative lookahead* - if you want to match something _not followed_ by something else:

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

*Positive lookbehind* - if you want to match something that is _preceded_ by something else. For example, search for space characters that have another space right to their left, and delete them.

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

*Negative lookbehind* - if you want to match something that is not preceded by something else. For example, our `<br />` sometimes look like `<br/>`. Replace all occurencies of `/>` with `{{space character}}/>` (disregard curly braces, it's only to make it more visible here) if they are not preceded with space already:

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

*Real life scenario*:

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

## API

```js
er(source_string, options_object, replacement_string)
```

You input a) a source string, b) a options object (which describes what to look for) and c) string to replace all the findings with.

### Options object:

```js
{
  leftOutsideNot: 'string/array, optional', // equivalent of regex negative lookbehind
  leftOutside: 'string/array, optional', // equivalent of regex positive lookbehind
  leftMaybe: 'string/array, optional', // optional string/array of strings to replace, if present on the left side of the keyword
  searchFor: 'string only, optional', // the keyword to look for in the source string
  rightMaybe: 'string/array, optional', // optional string/array of strings to replace, if present on the right side of the keyword
  rightOutside: 'string/array, optional', // equivalent of regex positive lookahead
  rightOutsideNot: 'string/array, optional' // equivalent of regex negative lookahead
}
```

## Rationale

Positive lookbehind and negative lookbehind are not supported in native JavaScript. Plus I find complex regexes, well, _complex_. Hence this library. I hope it is still simple-enough to bear 'easy' in its name.

Did I mention that this library is [astral-character](https://mathiasbynens.be/notes/javascript-unicode)-friendly? As you noticed in the examples above, it accepts emoji perfectly fine (and AVA tests prove this).

It's impossible to cause an infinite loop on this library (see tests 8.1-8.6).

Library is also friendly if any input is `number` type — numbers are converted and replaced string is returned in `string` type (see test 10.8).

Options object is fool-proof — you can omit keys or pass non-existing ones or pass non-string type variables — if the options key matches, it's first turned into string. You can even omit any or all of the inputs — library will return an empty string (see tests 9.1–9.6).

Same with replacment — empty, `null`, `boolean` or `undefined` are accepted and interpreted as a request to delete any results found. There's no replacement, only deletion in such case (see tests 10.1–10.7).

## Contributions

Any contributions are welcome! Fork, hack and file a pull request. Unit tests are written on [AVA](https://github.com/avajs/ava).

## License

MIT © [Roy Reveltas](https://github.com/revelt/)
