# string-extract-class-names

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Extract classes (or id's) from a string into an array

[![Build Status](https://travis-ci.org/code-and-send/string-extract-class-names.svg?branch=master)](https://travis-ci.org/code-and-send/string-extract-class-names) [![bitHound Overall Score](https://www.bithound.io/github/code-and-send/string-extract-class-names/badges/score.svg)](https://www.bithound.io/github/code-and-send/string-extract-class-names) [![bitHound Dependencies](https://www.bithound.io/github/code-and-send/string-extract-class-names/badges/dependencies.svg)](https://www.bithound.io/github/code-and-send/string-extract-class-names/master/dependencies/npm) [![bitHound Dev Dependencies](https://www.bithound.io/github/code-and-send/string-extract-class-names/badges/devDependencies.svg)](https://www.bithound.io/github/code-and-send/string-extract-class-names/master/dependencies/npm) [![Downloads/Month](https://img.shields.io/npm/dm/string-extract-class-names.svg)](https://www.npmjs.com/package/string-extract-class-names)

## Install

```sh
$ npm install --save string-extract-class-names
```

## Purpose

This library extracts the classes and id's from the string and returns them all put into an array.

I use `string-extract-class-names` to identify and delete unused CSS selectors in the library [email-remove-unused-css](https://github.com/code-and-send/email-remove-unused-css).

Since deleting of people's code is a risky task, a huge responsibility falls onto parts which _identify_ what should be deleted. That's why I extracted the `string-extract-class-names` from the `email-remove-unused-css` and set up a proper test suite.

Currently there 196 checks in `test.js` running on [AVA](https://github.com/avajs/ava). I'm checking all the possible (and impossible) strings in and around the class and id names to be 100% sure **only** correct class and id names are put into the results array.

## Examples

```js
var extract = require('string-extract-class-names')

// chop off tag, then the rest after the space character:
extract('div.first.second#third a[target=_blank]')
// => ['.first', '.second', '#third']

extract('?#id1#id2? #id3#id4> p > #id5#id6')
// => ['#id1', '#id2', '#id3', '#id4', '#id5', '#id6']
```

## API

```js
extract(
  string               // String. Input.
)
// => Extracted classes/id's in an array
```

## Contributing & testing

All contributions welcome. This library uses [Standard JavaScript](https://github.com/feross/standard) notation. See `test.js`. It's very minimalistic testing setup using [AVA](https://github.com/avajs/ava).

```bash
npm test
```

If you see anything incorrect whatsoever, [raise an issue](https://github.com/code-and-send/string-extract-class-names/issues). PR's are welcome — fork, hack and PR.

## Licence

MIT © [Roy Reveltas](https://github.com/revelt)
