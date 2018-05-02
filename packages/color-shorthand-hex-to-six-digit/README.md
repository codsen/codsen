# color-shorthand-hex-to-six-digit

> Convert shorthand hex color codes into full

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
- [Examples](#examples)
- [Usage in Gulp environment](#usage-in-gulp-environment)
- [API](#api)
- [Reliability](#reliability)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!-- prettier-ignore-end -->

## Install

```sh
npm i color-shorthand-hex-to-six-digit
```

```js
// consume as CommonJS require():
const conv = require("color-shorthand-hex-to-six-digit");
// or as an ES Module:
import conv from "color-shorthand-hex-to-six-digit";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                           | Size       |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------- | ---------- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/color-shorthand-hex-to-six-digit.cjs.js` | 1&nbsp;KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/color-shorthand-hex-to-six-digit.esm.js` | 1&nbsp;KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/color-shorthand-hex-to-six-digit.umd.js` | 11&nbsp;KB |

**[⬆ &nbsp;back to top](#)**

## Purpose

Email newsletters use a lot of styling using HTML attributes, for example, `<td bgcolor='#cccccc'>`. As you know, there is alternative way to write color codes in HEX — [shorthand](https://en.wikipedia.org/wiki/Web_colors#Shorthand_hexadecimal_form), for example, `<td bgcolor='#ccc'>`.

Certain contemporary email consumption software doesn't accept shorthand hex colour codes, what means you have to ensure all your email templates use **only full-length colour codes**. Some tooling libraries that work with SASS shorten the colour hex codes, and that's a best practice for web development, but not for email. We need a tool/library which could convert any shorthand hex codes from any input (array, plain object or string) into full notation.

This library takes any input: **array** (of strings, plain objects, other arrays or nested combination thereof), **plain object** (containing anything in values, including nested plain objects, arrays or strings) or **string**. Once received, it traverses the input and converts all found shorthand hex colour codes (#abc) into full-length (#aabbcc).

Additionally, all letters in all hex codes are converted to lowercase.

**[⬆ &nbsp;back to top](#)**

## Examples

```js
const conv = require("color-shorthand-hex-to-six-digit");

// converts shorthand hex color codes within strings:
conv("aaaa #f0c zzzz\n\t\t\t#fc0");
// => 'aaaa #ff00cc zzzz\n\t\t\t#ffcc00'

// converts shorthand hex colour codes within plain objects:
conv({
  a: "#ffcc00",
  b: "#f0c",
  c: "text"
});
// => {
//   a: '#ffcc00',
//   b: '#ff00cc',
//   c: 'text'
// }

// converts shorthand hex colour codes within arrays:
conv(["#fc0", "#f0c", "text", ""]);
// => [
//   '#ffcc00', '#ff00cc', 'text', ''
// ]

// converts shorthand hex colour codes within nested spaghetti's:
conv([[[[[[{ x: ["#fc0"] }]]]]], { z: "#f0c" }, ["text"], { y: "" }]);
// => [
//   [[[[[{x: ['#ffcc00']}]]]]], {z: '#ff00cc'}, ['text'], {y: ''}
// ]

// in all other cases it silently returns the input:
conv(null);
// => null
```

**[⬆ &nbsp;back to top](#)**

## Usage in Gulp environment

You don't need a Gulp plugin; you can simply use this library whenever you get in control of the final stream, or especially, SCSS variables.

For example, tap the `color-shorthand-hex-to-six-digit` right after importing the SCSS variables. I hope you are not misbehaving and all your colour variables are in one place only, as variables.

```js
// import SCSS variables from file (modules/src/scss/_variables.scss)

// native Node function to help with paths:
const path = require("path");
// convert variables SCSS file to .JSON:
const scssToJson = require("scss-to-json");
// lodash:
const _ = require("lodash");
// ...

function getScssVars() {
  var sassFilePath = path.resolve(
    __dirname,
    "modules/src/scss/_variables.scss"
  );
  var tempSassVars = scssToJson(sassFilePath);
  sassVars = _.mapKeys(tempSassVars, function(value, key) {
    return key.slice(1);
  });
  // convert all bad hex codes:
  sassVars = convShorthand(sassVars);
  // console.log('sassVars = ' + JSON.stringify(sassVars, null, 4))
}
```

I coded the `color-shorthand-hex-to-six-digit` to be recursive, that is, you can pass any nested objects/arrays/strings, no matter how deep-nested or tangled - all 3-character hex codes will be converted within the input.

If there is nothing to fix, `color-shorthand-hex-to-six-digit` behaves well, returning whatever was given, so feel free to assign your sources to the output of `color-shorthand-hex-to-six-digit`.

**[⬆ &nbsp;back to top](#)**

## API

The one and only input argument can be anything: string, plain object, nested array of whatever; you name it.
If input is not workable, for example, it's a function; it's simply returned intact.
This way, this library acts like a safety valve that acts when wrong hex codes pass through it, converting them.

PS. Input argument (in case of plain objects and arrays) is not mutated in any way. This package will clone the input and work on its copy. This is important. No ~~teenage turtle~~ mutations here.

**[⬆ &nbsp;back to top](#)**

## Reliability

I'm using only the best ingredients, namely [hex-color-regex](https://www.npmjs.com/package/hex-color-regex) by [@tunnckocore](https://www.npmjs.com/~tunnckocore) and standalone Lodash functions (`_.clonedeep`, `_.isplainobject` and `_.isstring`). This library is being currently used in commercial projects.

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/color-shorthand-hex-to-six-digit/issues).

* If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/color-shorthand-hex-to-six-digit/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/color-shorthand-hex-to-six-digit.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/color-shorthand-hex-to-six-digit
[travis-img]: https://img.shields.io/travis/codsen/color-shorthand-hex-to-six-digit.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/color-shorthand-hex-to-six-digit
[cov-img]: https://coveralls.io/repos/github/codsen/color-shorthand-hex-to-six-digit/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/color-shorthand-hex-to-six-digit?branch=master
[overall-img]: https://img.shields.io/bithound/code/github/codsen/color-shorthand-hex-to-six-digit.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/color-shorthand-hex-to-six-digit
[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/color-shorthand-hex-to-six-digit.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/color-shorthand-hex-to-six-digit/master/dependencies/npm
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/color-shorthand-hex-to-six-digit
[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/color-shorthand-hex-to-six-digit.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/color-shorthand-hex-to-six-digit/master/dependencies/npm
[vulnerabilities-img]: https://snyk.io/test/github/codsen/color-shorthand-hex-to-six-digit/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/color-shorthand-hex-to-six-digit
[downloads-img]: https://img.shields.io/npm/dm/color-shorthand-hex-to-six-digit.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/color-shorthand-hex-to-six-digit
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/color-shorthand-hex-to-six-digit
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-img]: https://img.shields.io/npm/l/color-shorthand-hex-to-six-digit.svg?style=flat-square
[license-url]: https://github.com/codsen/color-shorthand-hex-to-six-digit/blob/master/license.md
