# string-strip-html

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Strips HTML tags from strings. Detects legit unencoded brackets.

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

## Install

```sh
npm i string-strip-html
```

```js
// consume as a CommonJS require:
const stripHtml = require('string-strip-html')
// or as an ES Module:
import stripHtml from 'string-strip-html'

// it does not assume the output must be always HTML and detects legit brackets:
console.log(stripHtml('a < b and c > d')) // => 'a < b and c > d'
// leaves content between tags:
console.log(stripHtml('Some text <b>and</b> text.')) // => 'Some text and text.'
// adds spaces to prevent accidental string concatenation
console.log(stripHtml('aaa<div>bbb</div>ccc')) // => 'aaa bbb ccc'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/string-strip-html.cjs.js` | 17&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/string-strip-html.esm.js` | 17&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/string-strip-html.umd.js` | 35&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Purpose](#purpose)
- [API](#api)
- [Devil is in the details...](#devil-is-in-the-details)
- [Bigger picture](#bigger-picture)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Purpose

This library deletes HTML tags from strings and doesn't assume anything about the output.

You might take HTML and strip all tags and paste it back into HTML. But equally, you can take a photo of a christmas card from your grandmother and OCR it, remove all cheeky HTML tags she put around her greetings, then print out this cleaned text and stick it on the wall. OK, I'm exaggerating, but the idea is, we will not assume anything about the input source or destination of the output of this library. We will dilligently identify and delete all and only all HTML tags.

Other HTML stripping libraries (like [strip](https://www.npmjs.com/package/strip) and [striptags](https://www.npmjs.com/package/striptags)) _assume_ too much. For example, they will remove legit brackets, such as ` a < b and c > d` arguing that they don't belong in HTML at the first place and that's some sneaky attack vector. But again, if you stripped HTML tags, then by definition it's not HTML any more and HTML requirements don't apply, do they?

The scope of this library is to take the HTML and strip HTML tags and only HTML tags. If there's something else there besides tags such as greater than signs that doesn't belong in HTML, I don't care. Use different tool to process your string further.

**[⬆ &nbsp;back to top](#)**

## API

Basically, string-in string-out, with optional second input argument - an Optional Options Object.

### API - Input

Input argument | Type         | Obligatory? | Description
---------------|--------------|-------------|-----------
`input`        | String       | yes         | Text you want to strip HTML tags from
`opts`         | Plain object | no          | The Optional Options Object, see below for its API

If input arguments are supplied have any other types, an error will be `throw`n.

**[⬆ &nbsp;back to top](#)**

### Optional Options Object

An Optional Options Object's key | Type of its value             | Default               | Description
---------------------------------|-------------------------------|-----------------------|----------------------
{                                |                               |                       |
`ignoreTags`                     | Array of zero or more strings | `[]`                  | Any tags provided here will not be stripped from the input
`stripTogetherWithTheirContents` | Array of zero or more strings, `something falsey` | `['script', 'style', 'xml']` | My idea is you should be able to paste HTML and see only the text that would be visible in a browser window. Not CSS, not stuff from `script` tags. To turn this off, just set it to an empty array. Or something falsey.
}                                |                               |         |

The Optional Options Object is validated by [check-types-mini](https://github.com/codsen/check-types-mini) so please behave: the settings' values have to match the API and settings object should not have any extra keys, not defined in the API. Naughtiness will cause error `throw`s. I know, it's strict, but it prevents any API misconfigurations and helps to identify some errors early-on.

Here is the Optional Options Object in one place (in case you ever want to copy it):

```js
{
  ignoreTags: [],
  stripTogetherWithTheirContents: ['script', 'style', 'xml'],
}
```

**[⬆ &nbsp;back to top](#)**

### API - Output

A string of zero or more characters-length.

## Devil is in the details...

### Whitespace management

Two rules:

1. Output will be trimmed. Any leading (in front) whitespaces characters as well as trailing (in the end of the result) will be deleted.
2. Any whitespace between the tags will be deleted too. For example, `z<a>     <a>y` => `zy`. Also, anything `string.trim()`m-able to zero-length string will be removed, like aforementioned `\n` and `\r` and also tabs: `z<b>    \t\t\t    <b>y` => `zy`.

**[⬆ &nbsp;back to top](#)**

## Bigger picture

I scratched my itch, producing [detergent](https://github.com/codsen/detergent) - I needed a tool to clean the text before pasting into HTML because clients would supply briefing documents in all possible forms and shapes and often text would contain invisible Unicode characters. I've been given: Excel files, PSD's, Illustrator files, PDF's and of course, good old "nothing" where I had to reference existing code.

Detergent would remove the excessive whitespace, invisible characters and improve the text's English style. Detergent would also take HTML as input - stripping the tags, cleaning the text and giving back ready-to-paste sentences. But most of the cases, Detergent's input is just a text. And not always it ends up in HTML.

In September 2017, [string.js](https://www.npmjs.com/package/string) which originally performed the HTML-stripping was discovered as having [vulnerabilities](https://snyk.io/vuln/npm:string).

I was able to quickly replace all functions that Detergent was consuming from `string.js` except **HTML-stripping**.

This library is the last missing piece of a puzzle to get rid of `string.js`.

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/string-strip-html/issues).

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/string-strip-html/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt


[node-img]: https://img.shields.io/node/v/string-strip-html.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-strip-html

[npm-img]: https://img.shields.io/npm/v/string-strip-html.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/string-strip-html

[travis-img]: https://img.shields.io/travis/codsen/string-strip-html.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/string-strip-html

[cov-img]: https://coveralls.io/repos/github/codsen/string-strip-html/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-strip-html?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/string-strip-html.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/string-strip-html

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/string-strip-html.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/string-strip-html/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-strip-html

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/string-strip-html.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/string-strip-html/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-strip-html/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-strip-html

[downloads-img]: https://img.shields.io/npm/dm/string-strip-html.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-strip-html

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-strip-html

[license-img]: https://img.shields.io/npm/l/string-strip-html.svg?style=flat-square
[license-url]: https://github.com/codsen/string-strip-html/blob/master/license.md
