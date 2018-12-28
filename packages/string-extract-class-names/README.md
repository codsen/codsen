# string-extract-class-names

> Extract class (or id) name from a string

[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Install

```sh
npm i string-extract-class-names
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                     | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-extract-class-names.cjs.js` | 2 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-extract-class-names.esm.js` | 2 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-extract-class-names.umd.js` | 1 KB |

**[⬆ back to top](#markdown-header-string-extract-class-names)**

## Table of Contents

- [Install](#markdown-header-install)
- [Purpose](#markdown-header-purpose)
- [API](#markdown-header-api)
- [More examples](#markdown-header-more-examples)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Purpose

This library extracts the class and id names from the string and returns them all put into an array.

I use `string-extract-class-names` to identify all the CSS class names from the parsed HTML/CSS in the library [email-remove-unused-css](https://bitbucket.org/codsen/email-remove-unused-css) which detects and deletes the unused CSS styles.

Since deleting of people's code is a risky task, a huge responsibility falls onto parts which identify _what should be deleted_, and more importantly, parts which identify _class names and id's_. That's why I extracted the `string-extract-class-names` from the `email-remove-unused-css` and set up a proper test suite.

Currently there 196 checks in `test.js` running on [AVA](https://github.com/avajs/ava). I'm checking all the possible (and impossible) strings in and around the class and id names to be 100% sure **only** correct class and id names are put into the results array and nothing else.

**[⬆ back to top](#markdown-header-string-extract-class-names)**

## API

```js
stringExtractClassNames(inputString, [returnRangesInstead]);
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

**[⬆ back to top](#markdown-header-string-extract-class-names)**

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

**[⬆ back to top](#markdown-header-string-extract-class-names)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/string-extract-class-names/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/string-extract-class-names/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-string-extract-class-names)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-extract-class-names.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-extract-class-names
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/string-extract-class-names
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/string-extract-class-names/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/string-extract-class-names?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-extract-class-names
[downloads-img]: https://img.shields.io/npm/dm/string-extract-class-names.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-extract-class-names
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-extract-class-names
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/string-extract-class-names
