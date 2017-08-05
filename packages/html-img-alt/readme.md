# html-img-alt

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Adds missing ALT attributes to IMG tags and cleans within IMG tags. No HTML parsing used.

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
- [The algorithm](#the-algorithm)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i -S html-img-alt
```

```js
const alts = require('html-img-alt')
var res = alts('zzz<img        alt="123" >zzz')
console.log('res = ' + res)
// => 'res = zzz<img alt="123" >zzz'
```

**[⬆ &nbsp;back to top](#)**

## Idea

This library takes care of the `alt=` attributes (also wrongly-called "alt tags") on the image tags in HTML:

1. If `alt` attribute is missing on any `img` tag, it will add an empty-one.
2. If `alt` attribute is present on any `img` tag, it will run its contents through [string-unfancy](https://github.com/codsen/string-unfancy) to:
    - decode all HTML entities, recursively (in case multiple HTML encoding was applied)
    - replace "fancy" characters with their simpler equivalents within ASCII range. For example, curly single quotes are changed into single apostrophes. This includes dashes and all sorts of double quotes.
    - replace all non-breaking spaces with regular spaces
3. If `img` `alt` attribute has single quotes, it will remove them and all content within and replace with a pair of empty double quotes.
4. It will also normalise the whitespace within `img` tags, leaving one space between attributes and leaving one space before closing slash (XHTML) or closing bracket (HTML).

It works fine with both HTML and XHTML, it doesn't touch the closing slashes. Use a separate library for setting closing slashes on HTML tags.

The main USP of this library is that **it does not parse the HTML**. It will never `throw` and error because of a dirty code. It might throw because of wrong input type, but not because of something in the code.

**[⬆ &nbsp;back to top](#)**

## API

String-in, string-out. No options (yet).

**[⬆ &nbsp;back to top](#)**

## The algorithm

If somebody would come up with this problem, the first idea would be to tackle it by parsing the HTML, traversing the AST tree, finding `img` tags and checking are all `alt` attributes in place.

However, this way is: a) succeptible to HTML errors or any unrecognised code in the HTML (such as your back-end code or ESP campaign setup tags), and b) it's slow.

My chosen way, treating the HTML as string, is both fastest and the most resilient. We traverse the code **only once**. All findings are put into "to-do list", driven by combo of:

* [string-slices-array-push](https://github.com/codsen/string-slices-array-push) - which manages the string index ranges, allowing to add/remove/query; and
* [string-replace-slices-array](https://github.com/codsen/string-replace-slices-array) - which takes the final "to-do list" string ranges array and performs all those operations at once.

The operation speeds are so fast that we can allow it to be [synchronous](https://stackoverflow.com/q/16336367/3943954)!

When I recoded [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css/) this way (v.2+), treating HTML as string, the largest of the largest email templates' fixing time dropped from handful _minutes_ to _miliseconds_.

**[⬆ &nbsp;back to top](#)**

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/html-img-alt/issues). If you file a pull request, I'll do my best to help you to get it merged as soon as possible. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

**[⬆ &nbsp;back to top](#)**

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

[travis-img]: https://travis-ci.org/codsen/html-img-alt.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/html-img-alt

[cov-img]: https://coveralls.io/repos/github/codsen/html-img-alt/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/html-img-alt?branch=master

[bithound-img]: https://www.bithound.io/github/codsen/html-img-alt/badges/score.svg
[bithound-url]: https://www.bithound.io/github/codsen/html-img-alt

[deps-img]: https://www.bithound.io/github/codsen/html-img-alt/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/html-img-alt/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/html-img-alt/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/html-img-alt/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/html-img-alt.svg
[downloads-url]: https://www.npmjs.com/package/html-img-alt
