# string-extract-class-names

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Extract class (or id) name from a string

[![Build Status](https://travis-ci.org/code-and-send/string-extract-class-names.svg?branch=master)](https://travis-ci.org/code-and-send/string-extract-class-names) [![bitHound Overall Score](https://www.bithound.io/github/code-and-send/string-extract-class-names/badges/score.svg)](https://www.bithound.io/github/code-and-send/string-extract-class-names) [![Dependency Status](https://david-dm.org/code-and-send/string-extract-class-names.svg)](https://david-dm.org/code-and-send/string-extract-class-names) [![devDependency Status](https://david-dm.org/code-and-send/string-extract-class-names/dev-status.svg)](https://david-dm.org/code-and-send/string-extract-class-names#info=devDependencies) [![Downloads/Month](https://img.shields.io/npm/dm/string-extract-class-names.svg)](https://www.npmjs.com/package/string-extract-class-names)

## Purpose

I was working on another project where I parsed some HTML and CSS and wanted to extract all the classes and id's. However, most of the time, the classes were wrapped in other selectors and tags.

From this:

```css
sometagname a.class-name:hover
```

we want to extract this:

```css
.class-name
```

OR, from this:

```css
a.class-name[target=_blank]
```

extract this:

```css
.class-name
```

This library will chop off everything up to `.` (default) or `#` (set second input var) and then — any of the following characters after the class/id name:

```
~ !@$%^&*()+=,./';:"?><[]\{}|`#
```

and everything that follows after them (the space above is deliberately there).

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

Uses AVA.

## API

```js
extract(
  string,               // String. Input.
  chopUpToNotIncluding  // String. `.` for classes or `#` for id's. Default is `.`.
)
// => Extracted string
```

## Examples

```js
// second param is omitted, falls back to default "."
extract('div.class-name a[target=_blank]')
// => .class-name
// or with second parameter
extract('div.class-name a[target=_blank]', '.')
// => .class-name
```

We can extract id's be providing id selector as a second input parameter:

```js
extract('a#id-name[href^="https"]', '#')
// => #id-name
```

## Contributing & testing

All contributions welcome. This library uses [Standard JavaScript](https://github.com/feross/standard) notation. See `test.js`. It's very minimalistic testing setup using [AVA](https://github.com/avajs/ava).

```bash
npm test
```

If you see anything incorrect whatsoever, [raise an issue](https://github.com/code-and-send/string-extract-class-names/issues). PR's are welcome — fork, hack and PR.

## Licence

MIT © [Roy Reveltas](https://github.com/revelt)
