# html-img-alt

> Adds missing ALT attributes to IMG tags and cleans within IMG tags. No HTML parsing used.

[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Coverage Status][cov-img]][cov-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Test in browser][runkit-img]][runkit-url]

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

Transpiled code is served.

**[⬆ &nbsp;back to top](#)**

## Idea

This library takes care of the `alt=` attributes (also wrongly-called "alt tags") on the image tags in HTML:

1. If `alt` attribute is missing on any `img` tag, it will add an empty-one.
2. If `alt` attribute is present on any `img` tag, it will run its contents through [string-unfancy](https://github.com/codsen/string-unfancy) to:
    - decode all HTML entities, recursively (in case multiple HTML encoding was applied)
    - replace "fancy" characters with their simpler equivalents within ASCII range. For example, single curly quotes are changed into single apostrophes. This includes dashes and all sorts of double quotes.
    - replace all non-breaking spaces with regular spaces
3. If `img` `alt` attribute has single quotes, it will remove them and all content within and replace with a pair of empty double quotes.
4. It will also normalise the white space within `img` tags, leaving one space between attributes and leaving one space before the closing slash (XHTML) or closing bracket (HTML).
5. You can turn it off, but by default all the contents of the image `ALT` attributes will be trimmed and [unfancie'd](https://github.com/codsen/string-unfancy) (curly quotes, m/n-dashes replaced with single quotes, minuses). That's to keep it simple for old email consumption software and make it easier to QA them.

`html-img-alt` works fine with both HTML and XHTML; it doesn't touch the closing slashes. Use a separate library for enforcing the closing slashes (or removing them) from singleton tags (`br`, `hr` and so on).

The main USP of this library is that **it does not parse the HTML**. It will never `throw` an error because of a dirty code. It might throw because of wrong input type, but not because of something in the code.

**[⬆ &nbsp;back to top](#)**

## API

String-in, string-out. You can pass in the optional options object:

**Defaults**:

```js
    {
      unfancyTheAltContents: true
    }
```

`options` object's key         | Type     | Obligatory? | Default     | Description
-------------------------------|----------|-------------|-------------|----------------------
{                              |          |             |             |
`unfancyTheAltContents`        | Boolean  | no          | `true`      | Are each image's `alt` attributes contents trimmed and processed by [string-unfancy](https://github.com/codsen/string-unfancy)
}                              |          |             |             |

**[⬆ &nbsp;back to top](#)**

## The algorithm

If somebody came up with this problem, the first idea would be to tackle it by parsing the HTML, traversing the AST tree, finding `img` tags and checking are all `alt` attributes in place.

However, this way is a) susceptible to HTML errors or any unrecognised code in the HTML (such as your back-end code or ESP campaign setup tags), and b) it's slow.

My chosen way, treating the HTML as a string, is both fastest and the most resilient. We traverse the code **only once**. All findings are put into "to-do list", driven by a combo of:

* [string-slices-array-push](https://github.com/codsen/string-slices-array-push) - which manages the string index ranges, allowing to add/remove/query; and
* [string-replace-slices-array](https://github.com/codsen/string-replace-slices-array) - which takes the final "to-do list" string ranges array and performs all those operations at once.

The operation speeds are so fast that we can allow it to be [synchronous](https://stackoverflow.com/q/16336367/3943954)!

When I re-coded [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css/) this way (v.2+), treating HTML as a string, the largest of the largest email templates' fixing time dropped from handful _minutes_ to _miliseconds_.

**[⬆ &nbsp;back to top](#)**

## Contributing

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/html-img-alt/issues). If you file a pull request, I'll do my best to merge it quickly. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

If something doesn't work as you wished or you don't understand the inner workings of this library, _do raise an issue_. I'm happy to explain what's happening. Often some part of my README documentation is woolly, and I can't spot it myself. I need user feedback.

Also, if you miss a feature, request it by [raising](https://github.com/codsen/html-img-alt/issues) an issue as well.

I know it never happens, but if you would ever forked it and worked on a new feature, before filing a pull request, please make sure code is following the rules set in `.eslintrc` and `npm run test` passes fine. It's basically an `airbnb-base` rules preset of `eslint` with few exceptions: 1. No semicolons. 2. Allow plus-plus in `for` loops. See `./eslintrc`.

I dropped JS Standard because it misses many useful ESLint rules and has been neglected by its maintainers, using a half-year-old version of ESLint.

Cheers!

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

[npm-img]: https://img.shields.io/npm/v/html-img-alt.svg
[npm-url]: https://www.npmjs.com/package/html-img-alt

[travis-img]: https://travis-ci.org/codsen/html-img-alt.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/html-img-alt

[cov-img]: https://coveralls.io/repos/github/codsen/html-img-alt/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/html-img-alt?branch=master

[overall-img]: https://www.bithound.io/github/codsen/html-img-alt/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/html-img-alt

[deps-img]: https://www.bithound.io/github/codsen/html-img-alt/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/html-img-alt/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/html-img-alt/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/html-img-alt/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/html-img-alt.svg
[downloads-url]: https://www.npmjs.com/package/html-img-alt

[vulnerabilities-img]: https://snyk.io/test/github/codsen/html-img-alt/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/html-img-alt

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg
[deps2d-url]: http://npm.anvaka.com/#/view/2d/html-img-alt

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg
[runkit-url]: https://npm.runkit.com/html-img-alt
