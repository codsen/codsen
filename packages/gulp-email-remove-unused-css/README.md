# gulp-email-remove-unused-css

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Gulp plugin to remove unused CSS classes/id's from styles in HTML HEAD and inline within BODY

[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Downloads/Month][downloads-img]][downloads-url]

_If you have any difficulties with the output of this plugin, please use the [email-remove-unused-css](https://github.com/code-and-send/email-remove-unused-css/issues) issue tracker._

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
  return gulp.src('site.css')
    .pipe(remove({
      whitelist: ['.ExternalClass', '.ReadMsgBody', '.yshortcuts', '.Mso*', '.maxwidth-apple-mail-fix', '#outlook', '.module-*']
    }))
    .pipe(gulp.dest('./out'));
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

## Regarding removing unused CSS from web pages & competition

This library is meant to be used on any HTML where there are **no external stylesheets** and there are no JavaScript which could add or remove classes or id's dynamically. It's quite rare to find a **web page** that would be like that, but it's the case for all **email newsletters** and this library is aimed at cleaning email HTML code. If your website's HTML is like that, this library will work perfectly fine on it as well. Email HTML and website HTML are both the same markup language.

If you need more advanced CSS removal tools, check out [uncss](https://github.com/giakki/uncss) and [gulp-uncss](https://github.com/ben-eb/gulp-uncss) which runs a headless browser and is capable to parse external stylesheets. However, it's by magnitude slower and it's definitely an overkill for email HTML code.

There's also more direct competitor, [postcss-remove-unused](https://www.npmjs.com/package/postcss-remove-unused) which uses Cheerio, but:

1) `postcss-remove-unused` is tied with PostCSS and can't be used outside of it. Its _testing_ is also tied to PostCSS and dependent on it. On other hand, this library is only a Gulp wrapper for [email-remove-unused-css](https://github.com/code-and-send/email-remove-unused-css) which is tool-independent (reads `string`, outputs `string`). I'm a strong believer that core functionality should be decoupled from the wrappers, PostHTML, PostCSS, Gulp, Grunt, font-end interfaces or anything else. In the past I decoupled [Detergent's core](https://github.com/code-and-send/detergent) from its [front-end](https://detergent.io).
2) [postcss-remove-unused](https://www.npmjs.com/package/postcss-remove-unused) doesn't remove `id`'s, while [email-remove-unused-css](https://github.com/code-and-send/email-remove-unused-css) does and works for **both id's and classes** (and a mix of both)! Mind you, some of email hacks are based on id's, for example, `#outlook a {padding: 0; }` which causes "View in browser" toolbar menu link to appear on Outlook 2010. Style cleaning library must recognise id's in order to white-list them. This library does!

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://github.com/feross/standard) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/code-and-send/gulp-email-remove-unused-css/issues). If you file a pull request, I'll do my best to help you to get it merged in a timely manner. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email.

## Licence

> MIT License (MIT)

> Copyright (c) 2016 Code and Send Ltd, Roy Reveltas

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

[travis-img]: https://travis-ci.org/code-and-send/gulp-email-remove-unused-css.svg?branch=master
[travis-url]: https://travis-ci.org/code-and-send/gulp-email-remove-unused-css

[overall-img]: https://www.bithound.io/github/code-and-send/gulp-email-remove-unused-css/badges/score.svg
[overall-url]: https://www.bithound.io/github/code-and-send/gulp-email-remove-unused-css

[deps-img]: https://www.bithound.io/github/code-and-send/gulp-email-remove-unused-css/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/code-and-send/gulp-email-remove-unused-css/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/code-and-send/gulp-email-remove-unused-css/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/code-and-send/gulp-email-remove-unused-css/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/gulp-email-remove-unused-css.svg
[downloads-url]: https://www.npmjs.com/package/gulp-email-remove-unused-css
