# gulp-email-remove-unused-css

> Gulp plugin to remove unused CSS classes/id's from styles in HTML HEAD and inline within BODY

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

> Gulp plugin to remove unused CSS classes/id's from styles in HTML HEAD and inline within BODY

_If you have any difficulties with the output of this plugin, please use the [email-remove-unused-css](https://bitbucket.org/codsen/email-remove-unused-css/issues/new) issue tracker._

* Online web app: [EmailComb](https://emailcomb.com)
* The core library: [email-remove-unused-css](https://bitbucket.org/codsen/email-remove-unused-css).

## Table of Contents

- [Install](#markdown-header-install)
- [Example](#markdown-header-example)
- [Next level](#markdown-header-next-level)
- [Regarding removing unused CSS from web pages & competition](#markdown-header-regarding-removing-unused-css-from-web-pages-competition)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

Install using npm:

```bash
npm i gulp-email-remove-unused-css
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

**[⬆  back to top](#markdown-header-gulp-email-remove-unused-css)**

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

**[⬆  back to top](#markdown-header-gulp-email-remove-unused-css)**

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

**[⬆  back to top](#markdown-header-gulp-email-remove-unused-css)**

## Regarding removing unused CSS from web pages & competition

This library is meant to be used on any HTML where there are **no external stylesheets** and there are no JavaScript which could add or remove classes or id's dynamically. It's quite rare to find a **web page** that would be like that, but it's the case for all **email newsletters** and this library is aimed at cleaning email HTML code. If your website's HTML is like that, this library will work perfectly fine on it as well. Email HTML and website HTML are both the same markup language.

If you need more advanced CSS removal tools, check out [uncss](https://github.com/giakki/uncss) and [gulp-uncss](https://github.com/ben-eb/gulp-uncss) which runs a headless browser and are capable to parse external stylesheets. However, it's by magnitude slower and it's definitely an overkill for email HTML code.

There's also more direct competitor, [postcss-remove-unused](https://www.npmjs.com/package/postcss-remove-unused) which uses [Cheerio](https://www.npmjs.com/package/cheerio), but:

1) `postcss-remove-unused` is tied with PostCSS and can't be used outside of it. Its _testing_ is also tied to PostCSS and dependent on it. On other hand, _this library_ is only a Gulp wrapper for [email-remove-unused-css](https://bitbucket.org/codsen/email-remove-unused-css) which is tool-independent (reads `string`, outputs `string`). I'm a strong believer that core functionality should be decoupled from the wrappers, PostHTML, PostCSS, Gulp, Grunt, font-end interfaces or anything else. In the past I decoupled [Detergent's core](https://bitbucket.org/codsen/detergent) from its [front-end](https://detergent.io).

2) [postcss-remove-unused](https://www.npmjs.com/package/postcss-remove-unused) doesn't remove `id`'s, while this library _does_. It's important because some of _email code hacks_ are based on id's, for example, `#outlook a {padding: 0; }` which causes "View in browser" toolbar menu link to appear on Outlook 2010. Style cleaning library must recognise id's in order to white-list them.

**[⬆  back to top](#markdown-header-gulp-email-remove-unused-css)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/gulp-email-remove-unused-css/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/gulp-email-remove-unused-css/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆  back to top](#markdown-header-gulp-email-remove-unused-css)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt



[node-img]: https://img.shields.io/node/v/gulp-email-remove-unused-css.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/gulp-email-remove-unused-css

[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/gulp-email-remove-unused-css

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/gulp-email-remove-unused-css

[downloads-img]: https://img.shields.io/npm/dm/gulp-email-remove-unused-css.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/gulp-email-remove-unused-css

[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io

[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/gulp-email-remove-unused-css
