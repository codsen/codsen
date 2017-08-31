<h1 align="center">
  <img width="400" src="https://cdn.rawgit.com/codsen/string-unfancy/59e8cfc1/media/logo.png" alt="string-unfancy">
  <br>
</h1>

# string-unfancy

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Replace all fancy dashes, quotes, etc. with their simpler equivalents

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
- [Usage](#usage)
- [API](#api)
- [Example - treating the image alt attributes - Gulp and stream-tapping](#example---treating-the-image-alt-attributes---gulp-and-stream-tapping)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i -S string-unfancy
```

> or, if you work with image `alt` attributes, check out [html-img-alt](https://github.com/codsen/html-img-alt) which uses `string-unfancy`.

## Idea

This library converts fancy strings like curly apostrophes into not fancy ones, like a single quote. One could say it's the opposite of [Detergent](https://github.com/codsen/detergent).

`string-unfancy` main purpose is to simplify the images `alt` attribute content in email templates.

The list of covered characters includes all kinds of single quotes, double quotes, dashes and the non-breaking space.

Also, this library will recursively decode any HTML entities before performing the replacement.

PS. If you want a higher-level tool, [html-img-alt](https://github.com/codsen/html-img-alt) uses `string-unfancy` and performs many more fixes (adding empty `alt` attributes if they are missing, cleaning of the whitespace between the attributes, trimming of the `alt` contents and even replacing single quotes to double quotes).

## Usage

```js
const unfancy = require('string-unfancy')
var res = unfancy('someone’s')
console.log('res = ' + JSON.stringify(res1, null, 4))
// => "someone's"

// works with encoded HTML:
var res2 = unfancy('someone&rsquo;s')
console.log('res2 = ' + JSON.stringify(res2, null, 4))
// => "someone's"
```

## API

API is simple: `string` in, `string` out.

Caveat: if the input is not a `string` it will `throw`.

## Example - treating the image alt attributes - Gulp and stream-tapping

If you are using Gulp to build email templates, you can `tap` the stream, apply a function to it, then within that function, [replace](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/replace) all instances of `alt="..."` with their unfancied versions.

First, you need to `require` [gulp-tap](https://www.npmjs.com/package/gulp-tap) and [string-unfancy](https://www.npmjs.com/package/string-unfancy):

```js
const tap = require('gulp-tap')
const unfancy = require('string-unfancy')
```

Then, tap your main build task's stream, probably towards the end of the pipeline:

```js
...
.pipe(tap((file) => {
  file.contents = Buffer.from(unfancy(file.contents.toString()))
}))
.pipe(gulp.dest('dist')) // that's the final write happening, yours might be different
...
```

Then, declare a function somewhere within your `gulpfile.js`:

```js
function unfancy (input) {
  input = input.replace(/alt="[^"]*"/g, el => {
    return unfancy(el)
  })
  return input
}
```

As you see above, we're running an [inline function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/replace) upon all regex-matched characters.

And that's it! All image `alt` attributes will lose their HTML encoding and will have their fancy special characters converted to simple ASCII letter equivalents.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/string-unfancy/issues). If you file a pull request, I'll do my best to help you to get it merged as soon as possible. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

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

[npm-img]: https://img.shields.io/npm/v/string-unfancy.svg
[npm-url]: https://www.npmjs.com/package/string-unfancy

[travis-img]: https://travis-ci.org/codsen/string-unfancy.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/string-unfancy

[cov-img]: https://coveralls.io/repos/github/codsen/string-unfancy/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-unfancy?branch=master

[overall-img]: https://www.bithound.io/github/codsen/string-unfancy/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/string-unfancy

[deps-img]: https://www.bithound.io/github/codsen/string-unfancy/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/string-unfancy/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/string-unfancy/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/string-unfancy/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/string-unfancy.svg
[downloads-url]: https://www.npmjs.com/package/string-unfancy

[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-unfancy/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-unfancy

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-unfancy

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-ff9900.svg
[runkit-url]: https://npm.runkit.com/string-unfancy
