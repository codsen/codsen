# color-shorthand-hex-to-six-digit

> Convert shorthand hex color codes into full

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
- [Purpose](#purpose)
- [Examples](#examples)
- [Usage in Gulp environment](#usage-in-gulp-environment)
- [API](#api)
- [Reliability](#reliability)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i color-shorthand-hex-to-six-digit
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`conv`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const conv = require("color-shorthand-hex-to-six-digit");
```

or as an ES Module:

```js
import conv from "color-shorthand-hex-to-six-digit";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/color-shorthand-hex-to-six-digit/dist/color-shorthand-hex-to-six-digit.umd.js"></script>
```

```js
// in which case you get a global variable "colorShorthandHexToSixDigit" which you consume like this:
const conv = colorShorthandHexToSixDigit;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                           | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/color-shorthand-hex-to-six-digit.cjs.js` | 1 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/color-shorthand-hex-to-six-digit.esm.js` | 1 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/color-shorthand-hex-to-six-digit.umd.js` | 10 KB |

**[⬆ back to top](#)**

## Purpose

Email newsletters use a lot of styling using HTML attributes, for example, `<td bgcolor='#cccccc'>`. As you know, there is alternative way to write color codes in HEX — [shorthand](https://en.wikipedia.org/wiki/Web_colors#Shorthand_hexadecimal_form), for example, `<td bgcolor='#ccc'>`.

Certain contemporary email consumption software doesn't accept shorthand hex colour codes, what means you have to ensure all your email templates use **only full-length colour codes**. Some tooling libraries that work with SASS shorten the colour hex codes, and that's a best practice for web development, but not for email. We need a tool/library which could convert any shorthand hex codes from any input (array, plain object or string) into full notation.

This library takes any input: **array** (of strings, plain objects, other arrays or nested combination thereof), **plain object** (containing anything in values, including nested plain objects, arrays or strings) or **string**. Once received, it traverses the input and converts all found shorthand hex colour codes (#abc) into full-length (#aabbcc).

Additionally, all letters in all hex codes are converted to lowercase.

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

## API

The one and only input argument can be anything: string, plain object, nested array of whatever; you name it.
If input is not workable, for example, it's a function; it's simply returned intact.
This way, this library acts like a safety valve that acts when wrong hex codes pass through it, converting them.

PS. Input argument (in case of plain objects and arrays) is not mutated in any way. This package will clone the input and work on its copy. This is important. No ~~teenage turtle~~ mutations here.

**[⬆ back to top](#)**

## Reliability

I'm using only the best ingredients, namely [hex-color-regex](https://www.npmjs.com/package/hex-color-regex) by [@tunnckocore](https://www.npmjs.com/~tunnckocore) and standalone Lodash functions (`_.clonedeep`, `_.isplainobject` and `_.isstring`). This library is being currently used in commercial projects.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=color-shorthand-hex-to-six-digit%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acolor-shorthand-hex-to-six-digit%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=color-shorthand-hex-to-six-digit%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acolor-shorthand-hex-to-six-digit%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=color-shorthand-hex-to-six-digit%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acolor-shorthand-hex-to-six-digit%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/color-shorthand-hex-to-six-digit.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/color-shorthand-hex-to-six-digit
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/color-shorthand-hex-to-six-digit
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/color-shorthand-hex-to-six-digit
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/color-shorthand-hex-to-six-digit
[downloads-img]: https://img.shields.io/npm/dm/color-shorthand-hex-to-six-digit.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/color-shorthand-hex-to-six-digit
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/color-shorthand-hex-to-six-digit
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
