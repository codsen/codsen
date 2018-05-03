# detect-is-it-html-or-xhtml

> Answers, is the string input string more an HTML or XHTML (or neither)

[![Minimum Node version required][node-img]][node-url]
[![Build Status][travis-img]][travis-url]
[![Coverage][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

<!-- prettier-ignore-start -->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Purpose](#purpose)
- [API](#api)
- [Under the hood](#under-the-hood)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!-- prettier-ignore-end -->

## Install

```sh
npm i detect-is-it-html-or-xhtml
```

```js
// consume using a CommonJS require:
const detect = require("detect-is-it-html-or-xhtml");
// or as a native ES Module:
import detect from "detect-is-it-html-or-xhtml";
// then, pass it a string containing HTML:
console.log(
  detect(
    '<img src="some.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/>'
  )
);
// => 'xhtml'
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                     | Size       |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------- | ---------- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/detect-is-it-html-or-xhtml.cjs.js` | 2&nbsp;KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/detect-is-it-html-or-xhtml.esm.js` | 2&nbsp;KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/detect-is-it-html-or-xhtml.umd.js` | 795&nbsp;B |

**[⬆ &nbsp;back to top](#)**

## Purpose

As you know, XHTML is slightly different from HTML: **HTML** (4 and 5) does not close the `<img>` and other single tags, while **XHTML** does. There are more to that, but that's the major thing from developer's perspective.

When I was working on the [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css), I was parsing the HTML and rendering it back. Upon this _rendering-back_ stage, I had to identify, is the source code of the HTML-type, or XHTML, because I had to instruct the [renderer](https://github.com/posthtml/posthtml-render) to close all the single tags (or not close them). Ignoring this setting would have nasty consequences because, roughly, in only half of the cases my library would produce the correct code.

I couldn't find any library that analyses the code, telling is it HTML or XHTML. That's how `detect-is-it-html-or-xhtml` was born.

Feed the string into this library. If it's more of an HTML, it will output a string `"html"`. If it's more of an XHTML, it will output a string `xhtml`. If your code doesn't contain any tags, or it does, but there is no `doctype`, and it's impossible to distinguish between the two, it will output `null`.

**[⬆ &nbsp;back to top](#)**

## API

```js
detect(
  htmlAsString // Some code in string format. Or some other string.
);
// => 'html'|'xhtml'|null
```

### API - Input

| Input argument | Type   | Obligatory? | Description                                 |
| -------------- | ------ | ----------- | ------------------------------------------- |
| `htmlAsString` | String | yes         | String, hopefully containing some HTML code |

If the input is not String type, this package will throw an error. If the input is missing completely, it will return `null`.

**[⬆ &nbsp;back to top](#)**

### API - Output

| Type           | Value                   | Description                   |
| -------------- | ----------------------- | ----------------------------- |
| String or null | 'html', 'xhtml' or null | Identified type of your input |

**[⬆ &nbsp;back to top](#)**

## Under the hood

The algorithm is the following:

1.  Look for `doctype`. If recognised, Bob's your uncle, here's your answer.
2.  IF there's no `doctype` or it's messed up beyond recognition, DO scan all singleton tags (`<img>`, `<br>` and `<hr>`) and see which type the majority is (closed or not closed).
3.  In a rare case when there is an equal amount of both closed and unclosed tags, lean for `html`.
4.  If (there are no tags in the input) OR (there are no doctype tags and no singleton tags), return `null`.

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/detect-is-it-html-or-xhtml/issues).

* If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/detect-is-it-html-or-xhtml/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/detect-is-it-html-or-xhtml.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/detect-is-it-html-or-xhtml
[travis-img]: https://img.shields.io/travis/codsen/detect-is-it-html-or-xhtml.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/detect-is-it-html-or-xhtml
[cov-img]: https://coveralls.io/repos/github/codsen/detect-is-it-html-or-xhtml/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/detect-is-it-html-or-xhtml?branch=master
[overall-img]: https://img.shields.io/bithound/code/github/codsen/detect-is-it-html-or-xhtml.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/detect-is-it-html-or-xhtml
[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/detect-is-it-html-or-xhtml.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/detect-is-it-html-or-xhtml/master/dependencies/npm
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/detect-is-it-html-or-xhtml
[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/detect-is-it-html-or-xhtml.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/detect-is-it-html-or-xhtml/master/dependencies/npm
[vulnerabilities-img]: https://snyk.io/test/github/codsen/detect-is-it-html-or-xhtml/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/detect-is-it-html-or-xhtml
[downloads-img]: https://img.shields.io/npm/dm/detect-is-it-html-or-xhtml.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/detect-is-it-html-or-xhtml
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/detect-is-it-html-or-xhtml
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-img]: https://img.shields.io/npm/l/detect-is-it-html-or-xhtml.svg?style=flat-square
[license-url]: https://github.com/codsen/detect-is-it-html-or-xhtml/blob/master/license.md
