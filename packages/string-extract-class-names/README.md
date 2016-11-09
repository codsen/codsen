# string-extract-class-names

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Extract classes (or id's) from a string into an array

[![Build Status](https://travis-ci.org/code-and-send/string-extract-class-names.svg?branch=master)](https://travis-ci.org/code-and-send/string-extract-class-names) [![bitHound Overall Score](https://www.bithound.io/github/code-and-send/string-extract-class-names/badges/score.svg)](https://www.bithound.io/github/code-and-send/string-extract-class-names) [![Dependency Status](https://david-dm.org/code-and-send/string-extract-class-names.svg)](https://david-dm.org/code-and-send/string-extract-class-names) [![devDependency Status](https://david-dm.org/code-and-send/string-extract-class-names/dev-status.svg)](https://david-dm.org/code-and-send/string-extract-class-names#info=devDependencies) [![Downloads/Month](https://img.shields.io/npm/dm/string-extract-class-names.svg)](https://www.npmjs.com/package/string-extract-class-names)

## Examples

```js
// second param is omitted, falls back to default "."
extract('div.class-name.second-class-name a[target=_blank]')
// => ['.class-name', '.second-class-name']

// you can extract id and class combos:
extract('div#id.class a[target=_blank]', '#')
// => ['#id', '.class']
```

## Install

```sh
$ npm install --save string-extract-class-names
```

## Use

```js
var extract = require('string-extract-class-names')
```

## Test

```sh
$ npm test
```

Uses AVA for unit tests.

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
