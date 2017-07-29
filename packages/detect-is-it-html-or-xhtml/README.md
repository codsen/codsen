# detect-is-it-html-or-xhtml

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Answers, is the string input string more an HTML or XHTML (or neither)

[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Coverage Status][cov-img]][cov-url]
[![Downloads/Month][downloads-img]][downloads-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Purpose](#purpose)
- [Install](#install)
- [Use](#use)
- [API](#api)
  - [API - Input](#api---input)
  - [API - Output](#api---output)
- [Under the hood](#under-the-hood)
- [Testing](#testing)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Purpose

As you know, XHTML is slightly different from HTML: **HTML** (4 and 5) does not close the `<img>` and other single tags, while **XHTML** does. There are more to that, but that's the major thing from developer's perspective.

When I was working on the [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css), I was parsing the HTML and rendering it back. Upon this _rendering-back_ stage, I had to identify, is the source code of the HTML-type, or XHTML, because I had to instruct the [renderer](https://github.com/posthtml/posthtml-render) to close all the single tags (or not close them). Ignoring this setting would have nasty consequences because, roughly, in only half of the cases my library would produce the correct code.

I couldn't find any library that analyses the code, telling is it HTML or XHTML. That's how `detect-is-it-html-or-xhtml` was born.

Feed the string into this library. If it's more of an HTML, it will output a string `"html"`. If it's more of an XHTML, it will output a string `xhtml`. If your code doesn't contain any tags, or it does, but there is no `doctype`, and it's impossible to distinguish between the two, it will output `null`.

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

### API - Input

Input argument   | Type     | Obligatory? | Description
-----------------|----------|-------------|--------------------
`htmlAsString`   | String   | yes         | String, hopefully containing some HTML code

If the input is not String type, this package will throw an error. If the input is missing completely, it will return `null`.

### API - Output

Type              | Value                   | Description
------------------|-------------------------|---------------------------------------
String or null    | 'html', 'xhtml' or null | Identified type of your input

## Under the hood

The algorithm is the following:

1. Look for `doctype`. If recognised, Bob's your uncle, here's your answer.
2. IF there's no `doctype` or it's messed up beyond recognition, DO scan all singleton tags (`<img>`, `<br>` and `<hr>`) and see which type the majority is (closed or not closed).
3. In a rare case when there is an equal amount of both closed and unclosed tags, lean for `html`.
4. If (there are no tags in the input) OR (there are no doctype tags and no singleton tags), return `null`.

## Testing

```bash
$ npm test
```

For unit tests we use [AVA](https://github.com/avajs/ava), [Istanbul CLI](https://github.com/istanbuljs/nyc) and [JS Standard](https://standardjs.com) notation.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/detect-is-it-html-or-xhtml/issues). If you file a pull request, I'll do my best to help you to merge it soon. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email.

## Licence

> MIT License (MIT)

> Copyright (c) 2017 Codsen Ltd, Roy Revelt

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

[travis-img]: https://travis-ci.org/codsen/detect-is-it-html-or-xhtml.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/detect-is-it-html-or-xhtml

[overall-img]: https://www.bithound.io/github/codsen/detect-is-it-html-or-xhtml/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/detect-is-it-html-or-xhtml

[deps-img]: https://www.bithound.io/github/codsen/detect-is-it-html-or-xhtml/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/detect-is-it-html-or-xhtml/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/detect-is-it-html-or-xhtml/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/detect-is-it-html-or-xhtml/master/dependencies/npm

[cov-img]: https://coveralls.io/repos/github/codsen/detect-is-it-html-or-xhtml/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/detect-is-it-html-or-xhtml?branch=master

[downloads-img]: https://img.shields.io/npm/dm/detect-is-it-html-or-xhtml.svg
[downloads-url]: https://www.npmjs.com/package/detect-is-it-html-or-xhtml
