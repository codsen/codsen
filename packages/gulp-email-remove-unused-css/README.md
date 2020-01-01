# gulp-email-remove-unused-css

> Gulp plugin to remove unused CSS classes/id's from styles in HTML HEAD and inline within BODY

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

_If you have any difficulties with the output of this plugin, please use the [email-comb](https://gitlab.com/codsen/codsen/issues/new?issue%5Btitle%5D=email-comb%20package%20-%20put%20title%20here&issue%5Bdescription%5D=%23%23%20email-comb%0A%0Aput%20description%20here) issue tracker._

- Online web app: [EmailComb](https://emailcomb.com)
- The core library: `email-comb` ([npm](https://www.npmjs.com/package/email-comb), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/email-comb)).

## Table of Contents

- [Install](#install)
- [Example](#example)
- [Next level](#next-level)
- [Regarding removing unused CSS from web pages & competition](#regarding-removing-unused-css-from-web-pages--competition)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i gulp-email-remove-unused-css
```

## Example

```js
var gulp = require("gulp");
var remove = require("gulp-email-remove-unused-css");

gulp.task("default", function() {
  return gulp
    .src("src/*.html")
    .pipe(
      remove({
        whitelist: [
          ".ExternalClass",
          ".ReadMsgBody",
          ".yshortcuts",
          ".Mso*",
          ".maxwidth-apple-mail-fix",
          "#outlook",
          ".module-*"
        ]
      })
    )
    .pipe(gulp.dest("./dist"));
});
```

**[⬆ back to top](#)**

### Options

Since the main purpose of this library is to clean **email** HTML, it needs to cater for email code specifics. One of them is that CSS styles will contain fix or hack styles, meant for email software. For example, here are few of them:

```html
#outlook a { padding:0; } .ExternalClass, .ReadMsgBody { width:100%; }
.ExternalClass, .ExternalClass div, .ExternalClass font, .ExternalClass p,
.ExternalClass span, .ExternalClass td { line-height:100%; }
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

**[⬆ back to top](#)**

## Next level

If you start to overgrow the plugin's baby shirt and want to work with HTML directly, as string, stop using this library and use the [npm library](https://www.npmjs.com/package/email-comb), the API of this Gulp plugin directly.

The idea is the following: in Gulp, everything flows as a vinyl Buffer streams. You [tap](https://github.com/geejs/gulp-tap) the stream, convert it to `string`, perform the operations, then convert it back to Buffer and place it back. I wanted to come up with a visual analogy example using waste pipes but thought I'd rather won't.

Code-wise, here's the idea:

```js
const tap = require('gulp-tap')
const comb = require('email-comb')
const util = require('gulp-util')
const whitelist = ['.External*', '.ReadMsgBody', '.yshortcuts', '.Mso*', '#outlook', '.module*']

gulp.task('build', () => {
  return gulp.src('emails/*.html')
    .pipe(tap((file) => {
      const cleanedHtmlResult = comb(file.contents.toString(), { whitelist })
      util.log(util.colors.green(`\nremoved ${cleanedHtmlResult.deletedFromHead.length} from head: ${cleanedHtmlResult.deletedFromHead.join(' ')}`))
      util.log(util.colors.green(`\nremoved ${cleanedHtmlResult.deletedFromBody.length} from body: ${cleanedHtmlResult.deletedFromBody.join(' ')}`))
      file.contents = Buffer.from(cleanedHtmlResult.result)
}))
```

There are many benefits for tapping npm packages directly, without gulp plugins:

- You can add more functions, wrap them over `comb()` and Buffer-String-Buffer conversion will happen only once. If each of those functions was a Gulp plugin and did their Buffer-String-Buffer conversions that would be less efficient. Yes, all packages should be in streams but it adds complexity.
- Gulp plugins can only be same or worse maintained than their API packages which drive them. Often it's the latter case.
- Gulp plugins might be misconfigured and fail — even though the API package will work fine. Bigger surface to test, maintain and report bugs is worse than just one npm package.

**[⬆ back to top](#)**

## Regarding removing unused CSS from web pages & competition

This library is meant to be used on any HTML where there are **no external stylesheets** and there are no JavaScript which could add or remove classes or id's dynamically. It's quite rare to find a **web page** that would be like that, but it's the case for all **email newsletters** and this library is aimed at cleaning email HTML code. If your website's HTML is like that, this library will work perfectly fine on it as well. Email HTML and website HTML are both the same markup language.

If you need more advanced CSS removal tools, check out [uncss](https://github.com/giakki/uncss) and [gulp-uncss](https://github.com/ben-eb/gulp-uncss) which runs a headless browser and are capable to parse external stylesheets. However, it's by magnitude slower and it's definitely an overkill for email HTML code.

There's also more direct competitor, [postcss-remove-unused](https://www.npmjs.com/package/postcss-remove-unused) which uses [Cheerio](https://www.npmjs.com/package/cheerio), but:

1. `postcss-remove-unused` is tied with PostCSS and can't be used outside of it. Its _testing_ is also tied to PostCSS and dependent on it. On other hand, _this library_ is only a Gulp wrapper for [email-comb](https://gitlab.com/codsen/codsen/tree/master/packages/email-comb) which is tool-independent (reads `string`, outputs `string`). I'm a strong believer that core functionality should be decoupled from the wrappers, PostHTML, PostCSS, Gulp, Grunt, font-end interfaces or anything else. In the past I decoupled [Detergent's core](https://gitlab.com/codsen/codsen/tree/master/packages/detergent) from its [front-end](https://detergent.io).

2. [postcss-remove-unused](https://www.npmjs.com/package/postcss-remove-unused) doesn't remove `id`'s, while this library _does_. It's important because some of _email code hacks_ are based on id's, for example, `#outlook a {padding: 0; }` which causes "View in browser" toolbar menu link to appear on Outlook 2010. Style cleaning library must recognise id's in order to white-list them.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=gulp-email-remove-unused-css%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Agulp-email-remove-unused-css%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=gulp-email-remove-unused-css%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Agulp-email-remove-unused-css%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=gulp-email-remove-unused-css%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Agulp-email-remove-unused-css%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/gulp-email-remove-unused-css.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/gulp-email-remove-unused-css
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/gulp-email-remove-unused-css
[cov-img]: https://img.shields.io/badge/coverage-77.78%25-yellow.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/gulp-email-remove-unused-css
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/gulp-email-remove-unused-css
[downloads-img]: https://img.shields.io/npm/dm/gulp-email-remove-unused-css.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/gulp-email-remove-unused-css
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
