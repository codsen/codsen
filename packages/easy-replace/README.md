# easy-replace

> string replacement with positive and negative lookahead and lookbehind, no regexes

Emphasis on _no regexes_

[![Build Status](https://travis-ci.org/revelt/easy-replace.svg?branch=master)](https://travis-ci.org/revelt/easy-replace) [![Dependency Status](https://david-dm.org/revelt/easy-replace.svg)](https://david-dm.org/revelt/easy-replace) [![devDependency Status](https://david-dm.org/revelt/easy-replace/dev-status.svg)](https://david-dm.org/revelt/easy-replace#info=devDependencies) [![Downloads/Month](https://img.shields.io/npm/dm/easy-replace.svg)](https://www.npmjs.com/package/easy-replace)

<a href="https://github.com/feross/standard"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100"></a>


## Install

```bash
$ npm install --save easy-replace
```

## Test

```
$ npm test
```

## Usage

*Simple replace:*

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

```js
var er = require('easy-replace');

er(
  '🐴i🦄 🐴i i🦄 i',
  {
    leftOutsideNot: '',
    leftOutside: '',
    leftMaybe: '🐴',
    searchFor: 'i',
    rightMaybe: '🦄',
    rightOutside: '',
    rightOutsideNot: ''
  },
  'x'
);
//=> 'x x x x'
```
---

*Negative lookahead* - if you want to match something _not followed_ by something else:

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
    rightOutsideNot: 'c'
  },
  '🐴'
);
//=> 'a🦄c x🐴x'
```

---

*Positive lookbehind* - if you want to match something that is _preceded_ by something else. For example, search for space characters that have another space right to their left, and delete them.

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

*Negative lookbehind* - if you want to match something that is not preceded by something else. For example, our `<br />` sometimes look like `<br/>`. Replace all occurencies of `/>` with ` />` if they are not preceded with space already:

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

Real life scenario — adding a missing semicolon and/or ampersand, but only where it's missing:

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

You input a) a source string, b) a options object (which describes what to look for) and c) string to be placed instead of any search results.

### Settings object:

```js
{
  leftOutsideNot: 'string, optional', // equivalent of regex negative lookbehind
  leftOutside: 'string, optional', // equivalent of regex positive lookbehind
  leftMaybe: 'string, optional', // optional string to replace, if present on the left side of the keyword
  searchFor: 'string, optional', // the keyword to look for in the source string
  rightMaybe: 'string, optional', // optional string to replace, if present on the right side of the keyword
  rightOutside: 'string, optional', // equivalent of regex positive lookahead
  rightOutsideNot: 'string, optional' // equivalent of regex negative lookahead
}
```

## Rationale

Positive lookbehind and negative lookbehind are not supported in native JavaScript. Plus I find complex regexes, well, _complex_. Hence this library. I hope it is still simple-enough to bear 'easy' in its name.

Did I mention this library is [astral-character](https://mathiasbynens.be/notes/javascript-unicode)-friendly? As you noticed in the examples above, it accepts emoji perfectly fine (and AVA tests prove this).

It's impossible to cause an infinite loop on this library (see tests 8.1-8.6).

Library is also friendly if any input is `number` type — numbers are converted and replaced string is returned in `string` type (see test 10.8).

Options object is fool-proof — you can omit keys or pass non-existing ones or pass non-string type variables — if the options key matches, it's first turned into string. You can even omit any or all of the inputs — library will return an empty string (see tests 9.1–9.6).

Same with replacment — empty, `null`, `boolean` or `undefined` are accepted and interpreted as a request to delete any results found. There's no replacement, only deletion in such case (see tests 10.1–10.7).

## Contributions

Any contributions are welcome! Fork, hack and file a pull request. Unit tests are written on [AVA](https://github.com/avajs/ava).

## License

MIT © [Roy Reveltas](https://github.com/revelt/)
