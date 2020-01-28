# html-img-alt

> Adds missing ALT attributes to IMG tags and cleans within IMG tags. No HTML parsing used.

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
- [Idea](#idea)
- [API](#api)
- [For example,](#for-example)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i html-img-alt
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`alts`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const alts = require("html-img-alt");
```

or as an ES Module:

```js
import alts from "html-img-alt";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/html-img-alt/dist/html-img-alt.umd.js"></script>
```

```js
// in which case you get a global variable "htmlImgAlt" which you consume like this:
const alts = htmlImgAlt;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                       | Size   |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------- | ------ |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/html-img-alt.cjs.js` | 10 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/html-img-alt.esm.js` | 10 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/html-img-alt.umd.js` | 113 KB |

**[⬆ back to top](#)**

## Idea

This library takes care of the `alt=` attributes (also wrongly-called "alt tags") on the image tags in HTML:

1. If `alt` attribute is missing on any `img` tag, it will add an empty-one.
2. If `alt` attribute is present on any `img` tag, it will run its contents through [string-unfancy](https://gitlab.com/codsen/codsen/tree/master/packages/string-unfancy/) to:
   - decode all HTML entities, recursively (in case multiple HTML encoding was applied)
   - replace "fancy" characters with their simpler equivalents within ASCII range. For example, single curly quotes are changed into single apostrophes. This includes dashes and all sorts of double quotes.
   - replace all non-breaking spaces with regular spaces
3. If `img` `alt` attribute has single quotes, it will remove them and all content within and replace with a pair of empty double quotes.
4. It will also normalise the white space within `img` tags, leaving one space between attributes and leaving one space before the closing slash (XHTML) or closing bracket (HTML).
5. You can turn it off, but by default all the contents of the image `ALT` attributes will be trimmed and [unfancie'd](https://gitlab.com/codsen/codsen/tree/master/packages/string-unfancy/) (curly quotes, m/n-dashes replaced with single quotes, minuses). That's to keep it simple for old email consumption software and make it easier to QA them.

`html-img-alt` works fine with both HTML and XHTML; it doesn't touch the closing slashes. Use a separate library for enforcing the closing slashes (or removing them) from singleton tags (`br`, `hr` and so on).

The main USP of this library is that **it does not parse the HTML**. It will never `throw` an error because of a dirty code. It might throw because of wrong input type, but not because of something in the code.

**[⬆ back to top](#)**

## API

String-in, string-out. You can pass in the optional options object:

**Defaults**:

```js
{
  unfancyTheAltContents: true;
}
```

| `options` object's key  | Type    | Obligatory? | Default | Description                                                                                                                                                 |
| ----------------------- | ------- | ----------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                       |         |             |         |
| `unfancyTheAltContents` | Boolean | no          | `true`  | Are each image's `alt` attributes contents trimmed and processed by [string-unfancy](https://gitlab.com/codsen/codsen/tree/master/packages/string-unfancy/) |
| }                       |         |             |         |

**[⬆ back to top](#)**

## For example,

```js
import alts from "html-img-alt";
var res = alts('zzz<img        alt="123" >zzz');
console.log("res = " + res);
// => 'res = zzz<img alt="123" >zzz'
```

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=html-img-alt%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ahtml-img-alt%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=html-img-alt%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ahtml-img-alt%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=html-img-alt%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ahtml-img-alt%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/html-img-alt.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/html-img-alt
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/html-img-alt
[cov-img]: https://img.shields.io/badge/coverage-98.78%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/html-img-alt
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/html-img-alt
[downloads-img]: https://img.shields.io/npm/dm/html-img-alt.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/html-img-alt
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/html-img-alt
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
