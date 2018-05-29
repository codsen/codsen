# string-strip-html

> Strips HTML tags from strings. Detects legit unencoded brackets.

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

## Install

```sh
npm i string-strip-html
```

```js
// consume as a CommonJS require:
const stripHtml = require("string-strip-html");
// or as an ES Module:
import stripHtml from "string-strip-html";

// it does not assume the output must be always HTML and detects legit brackets:
console.log(stripHtml("a < b and c > d")); // => 'a < b and c > d'
// leaves content between tags:
console.log(stripHtml("Some text <b>and</b> text.")); // => 'Some text and text.'
// adds spaces to prevent accidental string concatenation
console.log(stripHtml("aaa<div>bbb</div>ccc")); // => 'aaa bbb ccc'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/string-strip-html.cjs.js` | 30&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/string-strip-html.esm.js` | 32&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/string-strip-html.umd.js` | 95&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Table of Contents

<!-- prettier-ignore-start -->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Purpose](#purpose)
- [API](#api)
- [Devil is in the details...](#devil-is-in-the-details)
- [Interesting](#interesting)
- [Bigger picture](#bigger-picture)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!-- prettier-ignore-end -->

## Purpose

This library deletes HTML tags from strings and doesn't assume anything. We will dilligently identify and delete **all and only all** HTML tags. It will do its best to distinguish `a < b and c > d` from `<b >` or `->` from `<!-- something -->`.

Other HTML stripping libraries (like [strip](https://www.npmjs.com/package/strip) and [striptags](https://www.npmjs.com/package/striptags)) _assume_ that the input will be strictly HTML and therefore, all unencoded brackets automatically mean it's a tag. For example, they would "clean" the string `a < b and c > d` into `a d`. Personally I think my competition, [strip](https://www.npmjs.com/package/strip) and [striptags](https://www.npmjs.com/package/striptags) (and the likes) are **lazy**. They disguise their lack of algorithmical creativity under HTML-spec smart-pants excuses.

The primary consumer for this library is [Detergent](https://github.com/codsen/detergent), where the input can be **both HTML and non-HTML**. Detergent might receive a wannabe arrow, `->`, and it will, depending on the setting, encode the bracket or leave it alone. But that bracket won't be interpreted as a **tag ending**. Why? Because algorithm is smart enough to "see" the dash there. Also, it is smart-enough to "see" that there were no opening tag either (not to mention, probably the algorithm detected _non-taggy_ characters like full stop and rang inner alarm-bells to ignore this bracket. And this library is driving Detergent's HTML tag-stripping feature.

The scope of this library is to take the HTML and **strip HTML tags and only HTML tags**. If there's something else there besides tags such as greater than signs that doesn't belong in HTML, I don't care. Just use a different tool to process your string before or after.

**[⬆ &nbsp;back to top](#)**

## API

Basically, string-in string-out, with optional second input argument - an Optional Options Object.

### API - Input

| Input argument | Type         | Obligatory? | Description                                        |
| -------------- | ------------ | ----------- | -------------------------------------------------- |
| `input`        | String       | yes         | Text you want to strip HTML tags from              |
| `opts`         | Plain object | no          | The Optional Options Object, see below for its API |

If input arguments are supplied have any other types, an error will be `throw`n.

**[⬆ &nbsp;back to top](#)**

### Optional Options Object

| An Optional Options Object's key | Type of its value                                 | Default                      | Description                                                                                                                                                                                                               |
| -------------------------------- | ------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                                |                                                   |                              |
| `ignoreTags`                     | Array of zero or more strings                     | `[]`                         | Any tags provided here will not be stripped from the input                                                                                                                                                                |
| `stripTogetherWithTheirContents` | Array of zero or more strings, `something falsey` | `['script', 'style', 'xml']` | My idea is you should be able to paste HTML and see only the text that would be visible in a browser window. Not CSS, not stuff from `script` tags. To turn this off, just set it to an empty array. Or something falsey. |
| }                                |                                                   |                              |

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

1.  Output will be trimmed. Any leading (in front) whitespaces characters as well as trailing (in the end of the result) will be deleted.
2.  Any whitespace between the tags will be deleted too. For example, `z<a> <a>y` => `z y`. Also, anything `string.trim()`m-able to zero-length string will be removed, like aforementioned `\n` and `\r` and also tabs: `z<b> \t\t\t <b>y` => `z y`.

**[⬆ &nbsp;back to top](#)**

## Interesting

`script` tags can be missing a closing tag's closing bracket — `alert` will still work! At least in latest Chrome:

```html
<!DOCTYPE html>
<html>
<head>
	<title>test</title>
</head>
<body>
<script>alert("123")</script
</body>
</html>
```

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

* If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/string-strip-html/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt



[node-img]: https://img.shields.io/node/v/string-strip-html.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-strip-html

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

[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier

[license-img]: https://img.shields.io/npm/l/string-strip-html.svg?style=flat-square
[license-url]: https://github.com/codsen/string-strip-html/blob/master/license.md
