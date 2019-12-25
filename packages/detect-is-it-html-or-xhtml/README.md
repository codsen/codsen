# detect-is-it-html-or-xhtml

> Answers, is the string input string more an HTML or XHTML (or neither)

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Example](#example)
- [Purpose](#purpose)
- [API](#api)
- [Under the hood](#under-the-hood)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i detect-is-it-html-or-xhtml
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`detectIsItHTMLOrXhtml`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const detectIsItHTMLOrXhtml = require("detect-is-it-html-or-xhtml");
```

or as an ES Module:

```js
import detectIsItHTMLOrXhtml from "detect-is-it-html-or-xhtml";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/detect-is-it-html-or-xhtml/dist/detect-is-it-html-or-xhtml.umd.js"></script>
```

```js
// in which case you get a global variable "detectIsItHtmlOrXhtml" which you consume like this:
const detectIsItHTMLOrXhtml = detectIsItHtmlOrXhtml;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                     | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/detect-is-it-html-or-xhtml.cjs.js` | 2 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/detect-is-it-html-or-xhtml.esm.js` | 2 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/detect-is-it-html-or-xhtml.umd.js` | 1 KB |

**[⬆ back to top](#)**

## Example

```js
const detect = require("detect-is-it-html-or-xhtml");
console.log(
  detect(
    '<img src="some.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/>'
  )
);
// => 'xhtml'
```

**[⬆ back to top](#)**

## Purpose

As you know, XHTML is slightly different from HTML: **HTML** (4 and 5) does not close the `<img>` and other single tags, while **XHTML** does. There are more to that, but that's the major thing from developer's perspective.

When I was working on the [email-comb](https://gitlab.com/codsen/codsen/tree/master/packages/email-comb), I was parsing the HTML and rendering it back. Upon this _rendering-back_ stage, I had to identify, is the source code of the HTML-type, or XHTML, because I had to instruct the [renderer](https://github.com/posthtml/posthtml-render) to close all the single tags (or not close them). Ignoring this setting would have nasty consequences because, roughly, in only half of the cases my library would produce the correct code.

I couldn't find any library that analyses the code, telling is it HTML or XHTML. That's how `detect-is-it-html-or-xhtml` was born.

Feed the string into this library. If it's more of an HTML, it will output a string `"html"`. If it's more of an XHTML, it will output a string `xhtml`. If your code doesn't contain any tags, or it does, but there is no `doctype`, and it's impossible to distinguish between the two, it will output `null`.

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

### API - Output

| Type           | Value                   | Description                   |
| -------------- | ----------------------- | ----------------------------- |
| String or null | 'html', 'xhtml' or null | Identified type of your input |

**[⬆ back to top](#)**

## Under the hood

The algorithm is the following:

1.  Look for `doctype`. If recognised, Bob's your uncle, here's your answer.
2.  IF there's no `doctype` or it's messed up beyond recognition, DO scan all singleton tags (`<img>`, `<br>` and `<hr>`) and see which type the majority is (closed or not closed).
3.  In a rare case when there is an equal amount of both closed and unclosed tags, lean for `html`.
4.  If (there are no tags in the input) OR (there are no doctype tags and no singleton tags), return `null`.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=detect-is-it-html-or-xhtml%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Adetect-is-it-html-or-xhtml%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=detect-is-it-html-or-xhtml%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Adetect-is-it-html-or-xhtml%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=detect-is-it-html-or-xhtml%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Adetect-is-it-html-or-xhtml%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/detect-is-it-html-or-xhtml.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/detect-is-it-html-or-xhtml
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/detect-is-it-html-or-xhtml
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/detect-is-it-html-or-xhtml
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/detect-is-it-html-or-xhtml
[downloads-img]: https://img.shields.io/npm/dm/detect-is-it-html-or-xhtml.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/detect-is-it-html-or-xhtml
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/detect-is-it-html-or-xhtml
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
