# detect-is-it-html-or-xhtml

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Answers, is the string input string more an HTML or XHTML (or neither)

[![Build Status](https://travis-ci.org/code-and-send/detect-is-it-html-or-xhtml.svg?branch=master)](https://travis-ci.org/code-and-send/detect-is-it-html-or-xhtml) [![bitHound Overall Score](https://www.bithound.io/github/code-and-send/detect-is-it-html-or-xhtml/badges/score.svg)](https://www.bithound.io/github/code-and-send/detect-is-it-html-or-xhtml) [![bitHound Dependencies](https://www.bithound.io/github/code-and-send/detect-is-it-html-or-xhtml/badges/dependencies.svg)](https://www.bithound.io/github/code-and-send/detect-is-it-html-or-xhtml/master/dependencies/npm) [![bitHound Dev Dependencies](https://www.bithound.io/github/code-and-send/detect-is-it-html-or-xhtml/badges/devDependencies.svg)](https://www.bithound.io/github/code-and-send/detect-is-it-html-or-xhtml/master/dependencies/npm) [![Downloads/Month](https://img.shields.io/npm/dm/detect-is-it-html-or-xhtml.svg)](https://www.npmjs.com/package/detect-is-it-html-or-xhtml)

## Purpose

As you know, XHTML is slightly different from HTML: **HTML** (4 and 5) does not close the `<img>` and other single tags, while **XHTML** does. There are more to that, but that's the major thing from developer's perspective.

When I was working on the [email-remove-unused-css](https://github.com/code-and-send/email-remove-unused-css) I was parsing the HTML and rendering it back. Upon this rendering-back stage I had to identify, is the source code of the HTML type, or XHTML, because I could instruct [renderer](https://github.com/posthtml/posthtml-render) the renderer to close all the single tags (or not). I couldn't find any library that analyses the code, is it HTML or XHTML. That's how `detect-is-it-html-or-xhtml` was born.

Feed the string into this library. If it's more of an HTML, it will output a string `"html"`. If it's more of an XHTML, it will output a string `xhtml`. If it doesn't contain any tags, or it does, but there is no `doctype` and it's impossible to distinguish between the two, it will output `null`.

## Install

```sh
$ npm install --save detect-is-it-html-or-xhtml
```

## Use

```js
var detect = require('detect-is-it-html-or-xhtml')
console.log(detect('<img src="some.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/>'))
// => 'xhtml'
```

## API

```js
detect(
  htmlAsString   // Some code in string format. Or some other string.
)
// => 'html'|'xhtml'|null
```

## Under the hood

The alrorithm is the following:

1. Look for `doctype`. If recognised, Bob's your uncle.
2. IF there's no `doctype` or it's messed up beyond recognition, DO scan all singleton tags (`<img>`, `<br>` and `<hr>`) and see of which type the majority is (closed or not closed).
4. In a rare case when there is an equal amount of both closed and unclosed tags, judge in favor of `html`.
5. If (there are no tags in the input) OR (there are no doctype tags and no singleton tags), return `null`.

## Contributing & testing

All contributions are welcome. This library uses [Standard JavaScript](https://github.com/feross/standard) notation. See `test.js`. It's very minimalistic testing setup using [AVA](https://github.com/avajs/ava).

```bash
npm test
```

If you see anything incorrect whatsoever, [raise an issue](https://github.com/code-and-send/detect-is-it-html-or-xhtml/issues). PR's are welcome — fork, hack and PR.

## Licence

MIT © [Roy Reveltas](https://github.com/revelt)
