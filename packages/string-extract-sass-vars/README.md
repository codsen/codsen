# string-extract-sass-vars

> Parse SASS variables file into a plain object of CSS key-value pairs

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![no dependencies][no-deps-img]][no-deps-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Install

```bash
npm i string-extract-sass-vars
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`extractVars`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const extractVars = require("string-extract-sass-vars");
```

or as an ES Module:

```js
import extractVars from "string-extract-sass-vars";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-extract-sass-vars/dist/string-extract-sass-vars.umd.js"></script>
```

```js
// in which case you get a global variable "stringExtractSassVars" which you consume like this:
const extractVars = stringExtractSassVars;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                   | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-extract-sass-vars.cjs.js` | 3 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-extract-sass-vars.esm.js` | 3 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-extract-sass-vars.umd.js` | 2 KB |

**[⬆ back to top](#)**

## Table of Contents

- [Install](#install)
- [Parse a SASS variables file](#parse-a-sass-variables-file)
- [API](#api)
- [Example](#example)
- [What this program doesn't do](#what-this-program-doesnt-do)
- [Why do you need this](#why-do-you-need-this)
- [Contributing](#contributing)
- [Licence](#licence)

## Parse a SASS variables file

```scss
// all variables are here!!!
// ------------------------------------------
$red: #ff6565; // this is red
// $green: #63ffbd; // no green here
$yellow: #ffff65; // this is yellow
$blue: #08f0fd; // this is blue
$fontfamily: Helvetica, sans-serif;
$border: 1px solid #dedede;
$borderroundedness: 3px;
$customValue1: tralala;
$customValue2: tralala;
// don't mind this comment about #ff6565;
$customValue3: 10;
```

into a plain object:

```js
{
  red: "#ff6565",
  yellow: "#ffff65",
  blue: "#08f0fd",
  fontfamily: "Helvetica, sans-serif",
  border: "1px solid #dedede",
  borderroundedness: "3px",
  customValue1: "tralala",
  customValue2: "tralala",
  customValue3: 10
}
```

**[⬆ back to top](#)**

## API

```js
extractVars(inputString);
```

### API - Input

| Input argument | Type   | Obligatory? | Description       |
| -------------- | ------ | ----------- | ----------------- |
| inputString    | String | yes         | String to process |

For example, a typical input for this program:

```scss
$red: #ff6565;
$blue: #08f0fd;
```

**[⬆ back to top](#)**

### API - Output

Returns **a plain object** of zero or more SASS file's key-value pairs.

For example, a typical output of this program:

```js
{
  red: "#ff6565",
  blue: "#08f0fd"
}
```

## Example

```js
const extractVars = require("string-extract-sass-vars");
const res = extractVars("$blue: #08f0fd;");
console.log(JSON.stringify(res, null, 4));
// => {
//       "blue": "#08f0fd"
//    }
```

## What this program doesn't do

This program is a quick parser for variables files or simple key-value pair SASS style content. It's not a fully-fledged SASS code parser.

Please, no fancy bits:

- No nesting
- No partials
- No modules
- Mixins
- No extend/inheritance
- No operators

**[⬆ back to top](#)**

## Why do you need this

If you use templating languages such as [Nunjucks](https://mozilla.github.io/nunjucks/), templating rendering engine is not aware of your SCSS global variables. It is a trivial task to ingest SCSS variables into Nunjucks "global" variable scope but those variables have to be parsed from a string (normally a file read by `fs`) into a plain object.

This program does the parsing part.

It is handy to have SCSS global variables accessible in your templating engine:

1. You can put CSS values inline if you wish (`<span style="color: {{ red }}">`)
2. You can put Nunjucks globals into SASS variables file - your CSS won't use them but all global constants will be in one place: both CSS and Nunjucks
3. Template's logic can use SASS variables file values in calculations (imagine, column count)

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-extract-sass-vars%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-extract-sass-vars%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-extract-sass-vars%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-extract-sass-vars%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-extract-sass-vars%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-extract-sass-vars%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-extract-sass-vars
[cov-img]: https://img.shields.io/badge/coverage-96.61%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-extract-sass-vars
[no-deps-img]: https://img.shields.io/badge/-no%20dependencies-brightgreen?style=flat-square
[no-deps-url]: https://www.npmjs.com/package/string-extract-sass-vars?activeTab=dependencies
[downloads-img]: https://img.shields.io/npm/dm/string-extract-sass-vars.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-extract-sass-vars
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-extract-sass-vars
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
