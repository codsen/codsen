# gulp-email-remove-unused-css

> Remove unused CSS from email templates

[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]

_If you have any difficulties with the output of this plugin, please use the [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css/issues) issue tracker._

* Online web app: [EmailComb](https://emailcomb.com)
* PostHTML plugin: [posthtml-email-remove-unused-css](https://github.com/codsen/posthtml-email-remove-unused-css/)
* The core library: [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css).

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Example](#example)
  - [Options](#options)
- [Next level](#next-level)
- [Regarding removing unused CSS from web pages & competition](#regarding-removing-unused-css-from-web-pages--competition)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

Install using npm:

```bash
$ npm install --save-dev gulp-email-remove-unused-css
```

## Example

```js
var gulp = require('gulp');
var remove = require('gulp-email-remove-unused-css');

gulp.task('default', function () {
  return gulp.src('src/*.html')
    .pipe(remove({
      whitelist: ['.ExternalClass', '.ReadMsgBody', '.yshortcuts', '.Mso*', '.maxwidth-apple-mail-fix', '#outlook', '.module-*']
    }))
    .pipe(gulp.dest('./dist'));
});
```

### Options

Since the main purpose of this library is to clean **email** HTML, it needs to cater for email code specifics. One of them is that CSS styles will contain fix or hack styles, meant for email software. For example, here are few of them:

```html
#outlook a { padding:0; }
.ExternalClass, .ReadMsgBody { width:100%; }
.ExternalClass, .ExternalClass div, .ExternalClass font, .ExternalClass p, .ExternalClass span, .ExternalClass td { line-height:100%; }
```

Obviously, you will not be using the above classes and id's in the `<body>` of your HTML code, what means they would get removed — they are present in `<head>` only. To avoid that, pass the classes and id's in the _whitelist_ key's value, as an array, for example:

```js
.pipe(remove({
  whitelist: ['.ExternalClass', '.ReadMsgBody', '.yshortcuts', '.Mso*', '.maxwidth-apple-mail-fix', '#outlook']
}))
```

You can also use a _glob_, for example in order to whitelist classes `module-1`, `module-2` ... `module-99`, `module-100`, you can simply whitelist them as `module-*`:

```js
.pipe(remove({
  whitelist: ['.ExternalClass', '.ReadMsgBody', '.yshortcuts', '.Mso*', '.maxwidth-apple-mail-fix', '#outlook', '.module-*']
}))
// => all class names that begin with ".module-" will not be touched by this library.
```

## Next level

If you start to overgrow the plugin's baby shirt and want to work with HTML directly, as string, stop using this library and use the [API](email-remove-unused-css) library of it instead.

The idea is the following: in Gulp, everything flows as a vinyl Buffer streams. You [tap](https://github.com/geejs/gulp-tap) the stream, convert it to `string`, perform the operations, then convert it back to Buffer and place it back. I wanted to come up with a visual analogy example using waste pipes but thought I'd rather won't.

Code-wise, here's the idea:

```js
const tap = require('gulp-tap')
const removeUnused = require('email-remove-unused-css')
const util = require('gulp-util')
const whitelist = ['.External*', '.ReadMsgBody', '.yshortcuts', '.Mso*', '#outlook', '.module*']

gulp.task('build', () => {
  return gulp.src('emails/*.html')
    .pipe(tap((file) => {
      const cleanedHtmlResult = removeUnused(file.contents.toString(), { whitelist })
      util.log(util.colors.green(`\nremoved ${cleanedHtmlResult.deletedFromHead.length} from head: ${cleanedHtmlResult.deletedFromHead.join(' ')}`))
      util.log(util.colors.green(`\nremoved ${cleanedHtmlResult.deletedFromBody.length} from body: ${cleanedHtmlResult.deletedFromBody.join(' ')}`))
      file.contents = Buffer.from(cleanedHtmlResult.result)
}))
```

## Regarding removing unused CSS from web pages & competition

This library is meant to be used on any HTML where there are **no external stylesheets** and there are no JavaScript which could add or remove classes or id's dynamically. It's quite rare to find a **web page** that would be like that, but it's the case for all **email newsletters** and this library is aimed at cleaning email HTML code. If your website's HTML is like that, this library will work perfectly fine on it as well. Email HTML and website HTML are both the same markup language.

If you need more advanced CSS removal tools, check out [uncss](https://github.com/giakki/uncss) and [gulp-uncss](https://github.com/ben-eb/gulp-uncss) which runs a headless browser and are capable to parse external stylesheets. However, it's by magnitude slower and it's definitely an overkill for email HTML code.

There's also more direct competitor, [postcss-remove-unused](https://www.npmjs.com/package/postcss-remove-unused) which uses [Cheerio](https://www.npmjs.com/package/cheerio), but:

1) `postcss-remove-unused` is tied with PostCSS and can't be used outside of it. Its _testing_ is also tied to PostCSS and dependent on it. On other hand, _this library_ is only a Gulp wrapper for [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css) which is tool-independent (reads `string`, outputs `string`). I'm a strong believer that core functionality should be decoupled from the wrappers, PostHTML, PostCSS, Gulp, Grunt, font-end interfaces or anything else. In the past I decoupled [Detergent's core](https://github.com/codsen/detergent) from its [front-end](https://detergent.io).

2) [postcss-remove-unused](https://www.npmjs.com/package/postcss-remove-unused) doesn't remove `id`'s, while this library _does_. It's important because some of _email code hacks_ are based on id's, for example, `#outlook a {padding: 0; }` which causes "View in browser" toolbar menu link to appear on Outlook 2010. Style cleaning library must recognise id's in order to white-list them.

## Contributing

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/email-all-chars-within-ascii/issues). If you file a pull request, I'll do my best to merge it quickly. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

If something doesn't work as you wished or you don't understand the inner workings of this library, _do raise an issue_. I'm happy to explain what's happening. Often some part of my README documentation is woolly, and I can't spot it myself. I need user feedback.

Also, if you miss a feature, request it by [raising](https://github.com/codsen/email-all-chars-within-ascii/issues) an issue as well.

I know it never happens, but if you would ever forked it and worked on a new feature, before filing a pull request, please make sure code is following the rules set in `.eslintrc` and `npm run test` passes fine. It's basically an `airbnb-base` rules preset of `eslint` with few exceptions: 1. No semicolons. 2. Allow plus-plus in `for` loops. See `./eslintrc`.

I dropped JS Standard because it misses many useful ESLint rules and has been neglected by its maintainers, it's currently using a half-year-old version of ESLint.

Cheers!

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

[npm-img]: https://img.shields.io/npm/v/gulp-email-remove-unused-css.svg
[npm-url]: https://www.npmjs.com/package/gulp-email-remove-unused-css

[travis-img]: https://travis-ci.org/codsen/gulp-email-remove-unused-css.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/gulp-email-remove-unused-css

[overall-img]: https://www.bithound.io/github/codsen/gulp-email-remove-unused-css/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/gulp-email-remove-unused-css

[deps-img]: https://www.bithound.io/github/codsen/gulp-email-remove-unused-css/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/gulp-email-remove-unused-css/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/gulp-email-remove-unused-css.svg
[downloads-url]: https://www.npmjs.com/package/gulp-email-remove-unused-css

[vulnerabilities-img]: https://snyk.io/test/github/codsen/gulp-email-remove-unused-css/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/gulp-email-remove-unused-css

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg
[deps2d-url]: http://npm.anvaka.com/#/view/2d/gulp-email-remove-unused-css
