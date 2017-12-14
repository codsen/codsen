<h1 align="center">
  <img width="400" src="https://cdn.rawgit.com/codsen/string-unfancy/59e8cfc1/media/logo.png" alt="string-unfancy">
  <br>
</h1>

# string-unfancy

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Replace all fancy dashes, quotes etc with their simpler equivalents

[![Minimum Node version required][node-img]][node-url]
[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![Coverage][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![MIT License][license-img]][license-url]

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
$ npm i string-unfancy
```

> or, if you work with image `alt` attributes, check out [html-img-alt](https://github.com/codsen/html-img-alt) which uses `string-unfancy`.

```js
// consume via a CommonJS require:
const unfancy = require('string-unfancy')
// or as an ES Module:
import unfancy from 'string-unfancy'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled, contains `require` and `module.exports` | `main`                | `dist/string-unfancy.cjs.js` | 2&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/string-unfancy.esm.js` | 1&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/string-unfancy.umd.js` | 59&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Idea

This library converts fancy strings like curly apostrophes into not fancy ones, like a single quote. One could say it's the opposite of [Detergent](https://github.com/codsen/detergent).

`string-unfancy` main purpose is to simplify the images `alt` attribute content in email templates.

The list of covered characters includes all kinds of single quotes, double quotes, dashes and the non-breaking space.

Also, this library will recursively decode any HTML entities before performing the replacement.

PS. If you want a higher-level tool, [html-img-alt](https://github.com/codsen/html-img-alt) uses `string-unfancy` and performs many more fixes (adding empty `alt` attributes if they are missing, cleaning of the whitespace between the attributes, trimming of the `alt` contents and even replacing single quotes to double quotes).

**[⬆ &nbsp;back to top](#)**

## Usage

```js
const unfancy = require('string-unfancy')
const res = unfancy('someone’s')
console.log('res = ' + JSON.stringify(res1, null, 4))
// => "someone's"

// works with encoded HTML:
const res2 = unfancy('someone&rsquo;s')
console.log('res2 = ' + JSON.stringify(res2, null, 4))
// => "someone's"
```

**[⬆ &nbsp;back to top](#)**

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

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/string-unfancy/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/string-unfancy/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give an advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/string-unfancy/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-unfancy.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-unfancy

[npm-img]: https://img.shields.io/npm/v/string-unfancy.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/string-unfancy

[travis-img]: https://img.shields.io/travis/codsen/string-unfancy.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/string-unfancy

[cov-img]: https://coveralls.io/repos/github/codsen/string-unfancy/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-unfancy?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/string-unfancy.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/string-unfancy

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/string-unfancy.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/string-unfancy/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-unfancy

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/string-unfancy.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/string-unfancy/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-unfancy/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-unfancy

[downloads-img]: https://img.shields.io/npm/dm/string-unfancy.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-unfancy

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-unfancy

[license-img]: https://img.shields.io/npm/l/string-unfancy.svg?style=flat-square
[license-url]: https://github.com/codsen/string-unfancy/blob/master/license.md
