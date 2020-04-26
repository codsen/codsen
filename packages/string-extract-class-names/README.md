# string-extract-class-names

> Extract class (or id) name from a string

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Install

```bash
npm i string-extract-class-names
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`extract`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const extract = require("string-extract-class-names");
```

or as an ES Module:

```js
import extract from "string-extract-class-names";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-extract-class-names/dist/string-extract-class-names.umd.js"></script>
```

```js
// in which case you get a global variable "stringExtractClassNames" which you consume like this:
const extract = stringExtractClassNames;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                     | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-extract-class-names.cjs.js` | 4 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-extract-class-names.esm.js` | 3 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-extract-class-names.umd.js` | 12 KB |

**[⬆ back to top](#)**

## Table of Contents

- [Install](#install)
- [Purpose](#purpose)
- [API](#api)
- [More examples](#more-examples)
- [Contributing](#contributing)
- [Licence](#licence)

## Purpose

This library extracts the class and id names from the string and returns them all put into an array.

I use `string-extract-class-names` to identify all the CSS class names from the parsed HTML/CSS in the library [email-comb](https://gitlab.com/codsen/codsen/tree/master/packages/email-comb) which detects and deletes the unused CSS styles.

Since deleting of people's code is a risky task, a huge responsibility falls onto parts which identify _what should be deleted_, and more importantly, parts which identify _class names and id's_. That's why I extracted the `string-extract-class-names` from the `email-remove-unused-css` and set up a proper test suite.

Currently there 196 checks in `test.js` running on [AVA](https://github.com/avajs/ava). I'm checking all the possible (and impossible) strings in and around the class and id names to be 100% sure **only** correct class and id names are put into the results array and nothing else.

**[⬆ back to top](#)**

## API

```js
extract(inputString, [returnRangesInstead]);
```

### API - Input

| Input argument      | Type    | Obligatory? | Description                                                                                            |
| ------------------- | ------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| inputString         | String  | yes         | String to process                                                                                      |
| returnRangesInstead | Boolean | no          | Default - `false` - return arrays of strings - selectors; optionally - `true` - return array of ranges |

By ranges we mean string slice ranges, arrays of two elements where both arguments match the `String.slice` first two arguments, `beginIndex` and `endIndex`.

For example,

```js
const extract = require("string-extract-class-names");
const str = "div.first-class.second-class";

// default settings: each selector as string will be put in an array and returned:
const res1 = extract(str);
console.log("res1 = " + res1);
// => res1 = [".first-class", ".second-class"]

// optionally, you can request ranges:
const res2 = extract(str, true);
console.log("res2 = " + res2);
// => res2 = [[3, 15], [15, 28]]
```

**[⬆ back to top](#)**

## More examples

```js
const extract = require("string-extract-class-names");

// two classes and one id extracted:
const res3 = extract("div.first.second#third a[target=_blank]");
console.log("res3 = " + res3);
// => res3 = ['.first', '.second', '#third']

// six id's extracted (works even despite the nonsensical question mark characters):
const res4 = extract("?#id1#id2? #id3#id4> p > #id5#id6");
console.log("res4 = " + res4);
// => res4 = ['#id1', '#id2', '#id3', '#id4', '#id5', '#id6']
```

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-extract-class-names%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-extract-class-names%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-extract-class-names%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-extract-class-names%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-extract-class-names%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-extract-class-names%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-extract-class-names
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-extract-class-names
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-extract-class-names
[downloads-img]: https://img.shields.io/npm/dm/string-extract-class-names.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-extract-class-names
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-extract-class-names
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
