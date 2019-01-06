# string-collapse-leading-whitespace

> Collapse the leading and trailing whitespace of a string

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#markdown-header-install)
- [Idea](#markdown-header-idea)
- [API - Input](#markdown-header-api-input)
- [API - Output](#markdown-header-api-output)
- [Example](#markdown-header-example)
- [Purpose](#markdown-header-purpose)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i string-collapse-leading-whitespace
```

```js
// consume via a CommonJS require:
const collapseLeadingWhitespace = require("string-collapse-leading-whitespace");
// or as an ES Module:
import collapseLeadingWhitespace from "string-collapse-leading-whitespace";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                             | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------ | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-collapse-leading-whitespace.cjs.js` | 2 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-collapse-leading-whitespace.esm.js` | 2 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-collapse-leading-whitespace.umd.js` | 739 B |

**[⬆ back to top](#markdown-header-string-collapse-leading-whitespace)**

## Idea

```js
// does nothing to trimmed strings:
'aaa' => 'aaa'
// if leading or trailing whitespace doesn't contain \n, collapse to a single space
'  aaa   ' => ' aaa '
// otherwise, collapse to a single \n
'     \n\n   aaa  \n\n\n    ' => '\naaa\n'
```

**[⬆ back to top](#markdown-header-string-collapse-leading-whitespace)**

## API - Input

| Input argument                 | Type                        | Obligatory? | Default   | Description                                                                            |
| ------------------------------ | --------------------------- | ----------- | --------- | -------------------------------------------------------------------------------------- |
| `str`                          | String                      | yes         | undefined | Source string to work on                                                               |
| `originalLimitLinebreaksCount` | Natural number (excl. zero) | no          | `1`       | Maximum line breaks that will be put when leading or trailing whitespace contains any. |

If first input argument is not a string, it will be just returned back, untouched.
If second input argument is zero or falsey or not a number, it will be set to `1` and application will continue as normal.

**[⬆ back to top](#markdown-header-string-collapse-leading-whitespace)**

## API - Output

String of zero or more characters. If input was not a string, same thing will be returned back, without an error.

## Example

```js
const collapseLeadingWhitespace = require("string-collapse-leading-whitespace");
const someStr = "\n\n\n tralalaa \n\n";
const res1 = collapseLeadingWhitespace(someStr); // default is one leading/trailing line break
console.log(
  `${`\u001b[${33}m${`res1`}\u001b[${39}m`} = ${JSON.stringify(res1, null, 4)}`
);
// res1 = "\ntralalaa\n"
// result has single leading/trailing linebreak because second argument's default is 1.

// -----------------------------------------------------------------------------

// now, same thing, but set it to two:
const res2 = collapseLeadingWhitespace(someStr, 2); // notice second arg set
console.log(
  `${`\u001b[${33}m${`res2`}\u001b[${39}m`} = ${JSON.stringify(res2, null, 4)}`
);
// res2 = "\n\ntralalaa\n\n"
// result has two leading, two trailing. Leading count was capped, trailing reached max anyway. There were two only leading line breaks.
// Notice spaces/tabs are/would be removed.

// -----------------------------------------------------------------------------

// now set it to three:
const res3 = collapseLeadingWhitespace(someStr, 3); // notice second arg set
console.log(
  `${`\u001b[${33}m${`res3`}\u001b[${39}m`} = ${JSON.stringify(res3, null, 4)}`
);
// res3 = "\n\n\ntralalaa\n\n"
// result has three leading line breaks, them maxed out - there were three. There were two trailing linebreaks, allowance was for three. End result - two trailing linebreaks.
// All spaces were removed.
```

**[⬆ back to top](#markdown-header-string-collapse-leading-whitespace)**

## Purpose

I'm going to use it in [string-slices-array-push](https://bitbucket.org/codsen/string-slices-array-push).

## Contributing

- If you see an error, [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=string-collapse-leading-whitespace%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=string-collapse-leading-whitespace%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=string-collapse-leading-whitespace%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://bitbucket.org/codsen/codsen/src/) via BitBucket, then write code, then file a pull request via BitBucket. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#markdown-header-string-collapse-leading-whitespace)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/string-collapse-leading-whitespace.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-collapse-leading-whitespace
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/codsen/src/master/packages/string-collapse-leading-whitespace
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/codsen/src/master/packages/string-collapse-leading-whitespace/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/codsen/src/master/packages/string-collapse-leading-whitespace?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-collapse-leading-whitespace
[downloads-img]: https://img.shields.io/npm/dm/string-collapse-leading-whitespace.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-collapse-leading-whitespace
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-collapse-leading-whitespace
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/codsen/src/master/packages/string-collapse-leading-whitespace
