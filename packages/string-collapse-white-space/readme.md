# string-collapse-white-space

> Efficient collapsing of white space with optional outer- and/or line-trimming and HTML tag recognition

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [TLDR;](#markdown-header-tldr)
- [Install](#markdown-header-install)
- [The API](#markdown-header-the-api)
- [Algorithm](#markdown-header-algorithm)
- [Usage](#markdown-header-usage)
- [Smart bits](#markdown-header-smart-bits)
- [Practical use](#markdown-header-practical-use)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## TLDR;

<!-- prettier-ignore-start -->
Take string. First **trim** the outsides, then **collapse** two and more spaces into one.

```js
'    aaa    bbbb    ' -> 'aaa bbbb'
```

When trimming, any whitespace will be collapsed, including tabs, line breaks and so on.
When collapsing, _only spaces_ are collapsed. Non-space whitespace within text won't be collapsed.

```js
'   \t\t\t   aaa     \t     bbbb  \t\t\t\t  ' -> 'aaa \t bbbb'
```

(Optional, on by default) **Collapse** more aggressively within recognised **HTML tags**:

```js
'text <   span   >    contents   <  /  span   > more text' -> 'text <span> contents </span> more text'
```

(Optional, off by default) **Trim** each line:

```js
'   aaa   \n   bbb   ' -> 'aaa\nbbb'
```

(Optional, off by default) Delete empty or whitespace-only rows:

```js
'a\n\n\nb' -> 'a\nb'
```
<!-- prettier-ignore-end -->

**[⬆ back to top](#markdown-header-string-collapse-white-space)**

## Install

```bash
npm i string-collapse-white-space
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                      | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-collapse-white-space.cjs.js` | 16 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-collapse-white-space.esm.js` | 17 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-collapse-white-space.umd.js` | 49 KB |

**[⬆ back to top](#markdown-header-string-collapse-white-space)**

## The API

**collapse (string\[, opts])**

Input:

- the first argument - string only or will `throw`.
- the second argument - optional options object. Anything else than `undefined`, `null` or a plain object will `throw`.

Options object is sanitized by [check-types-mini](https://bitbucket.org/codsen/check-types-mini) which will `throw` if you set options' keys to wrong types or add unrecognized keys. You'll thank me later.

**[⬆ back to top](#markdown-header-string-collapse-white-space)**

### Optional Options Object's API:

| `options` object's key | Type    | Obligatory? | Default | Description                                                                                                                                                                         |
| ---------------------- | ------- | ----------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                      |         |             |         |
| `trimStart`            | Boolean | no          | `true`  | if `false`, leading whitespace will be just collapsed. That might a single space, for example, if there are bunch of leading spaces.                                                |
| `trimEnd`              | Boolean | no          | `true`  | if `false`, trailing whitespace will be just collapsed.                                                                                                                             |
| `trimLines`            | Boolean | no          | `false` | if `true`, every line will be trimmed (spaces, tabs, line breaks of all kinds will be deleted, also non-breaking spaces, if `trimnbsp` is set to `true`)                            |
| `trimnbsp`             | Boolean | no          | `false` | when trimming, do we delete non-breaking spaces (if set to `true`, answer would be "yes"). This setting also affects `trimLines` setting above.                                     |
| `recogniseHTML`        | Boolean | no          | `true`  | if `true`, the space directly within recognised 118 HTML tag brackets will be collapsed tightly: `< div >` -> `<div>`. It will not touch any other brackets such as string `a > b`. |
| `removeEmptyLines`     | Boolean | no          | `false` | if any line can be trimmed to empty string, it will be removed.                                                                                                                     |
| `returnRangesOnly`     | Boolean | no          | `false` | if enabled, ranges array (array of arrays) or `null` (if there was nothing to collapse) will be returned instead                                                                    |
| }                      |         |             |         |

**Defaults**:

```js
{
  trimStart: true, // otherwise, leading whitespace will be collapsed to a single space
  trimEnd: true, // otherwise, trailing whitespace will be collapsed to a single space
  trimLines: false, // activates trim per-line basis
  trimnbsp: false, // non-breaking spaces are trimmed too
  recogniseHTML: true, // collapses whitespace around HTML brackets
  removeEmptyLines: false, // if line trim()'s to an empty string, it's removed
  returnRangesOnly: false // if on, only ranges array is returned
}
```

**[⬆ back to top](#markdown-header-string-collapse-white-space)**

## Algorithm

Traverse the string once, gather a list of ranges indicating white space indexes, delete them all in one go and return the new string.

This library traverses the string _only once_ and performs the deletion _only once_. It recognises Windows, Unix and Linux line endings.

Optionally (on by default), it can recognise (X)HTML tags (any out of 118) and for example collapse `< div..` → `<div..`.

This algorithm **does not use regexes**.

**[⬆ back to top](#markdown-header-string-collapse-white-space)**

## Usage

```js
const collapse = require("string-collapse-white-space");

let res1 = collapse("  aaa     bbb    ccc   dddd  ");
console.log("res1 = " + res1);
// => "aaa bbb ccc dddd"

let res2 = collapse("   \t\t\t   aaa   \t\t\t   ");
console.log("res2 = " + res2);
// => 'aaa'

let res3 = collapse("   aaa   bbb  \n    ccc   ddd   ", { trimLines: true });
console.log("res3 = " + res3);
// => 'aaa bbb\nccc ddd'

// \xa0 is an unencoded non-breaking space:
let res4 = collapse(
  "     \xa0    aaa   bbb    \xa0    \n     \xa0     ccc   ddd   \xa0   ",
  { trimLines: true, trimnbsp: true }
);
console.log("res4 = " + res4);
// => 'aaa bbb\nccc ddd'
```

**[⬆ back to top](#markdown-header-string-collapse-white-space)**

## Smart bits

There are some sneaky false-positive cases, for example:

`Equations: a < b and c > d, for example.`

Notice the part `< b and c >` almost matches the HTML tag description - it's wrapped with brackets, starts with legit HTML tag name (one out of 118, for example, `b`) and even space follows it. The current version of the algorithm will detect false-positives by counting amount of space, equal, double quote and line break characters within suspected tag (string part between the brackets).

**The plan is**: if there are spaces, this means this suspect tag has got attributes. In that case, there has to be at least one equal sign or equal count of unescaped double quotes. Otherwise, nothing will be collapsed/deleted from that particular tag.

**[⬆ back to top](#markdown-header-string-collapse-white-space)**

## Practical use

I want a reliable string white space collapsing library which would traverse the input ONLY ONCE and gather result IN ONE GO, before returning it. This is not regex approach where we mutate the string when trimming, then mutate again when collapsing... No. It's a proper traversal within a backward FOR loop (backward instead of forwards is for better speed), where we only gather the intel while traversing.

I'm going to use it first in [Detergent](https://bitbucket.org/codsen/detergent), but you never know, it might prove handy in email template building in general.

**[⬆ back to top](#markdown-header-string-collapse-white-space)**

## Contributing

- If you see an error, [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=string-collapse-white-space%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=string-collapse-white-space%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=string-collapse-white-space%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://bitbucket.org/codsen/codsen/src/) via BitBucket, then write code, then file a pull request via BitBucket. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#markdown-header-string-collapse-white-space)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/string-collapse-white-space.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-collapse-white-space
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/codsen/src/master/packages/string-collapse-white-space
[cov-img]: https://img.shields.io/badge/coverage-100%-brightgreen.svg?style=flat-square
[cov-url]: https://bitbucket.org/codsen/codsen/src/master/packages/string-collapse-white-space
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-collapse-white-space
[downloads-img]: https://img.shields.io/npm/dm/string-collapse-white-space.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-collapse-white-space
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-collapse-white-space
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/codsen/src/master/packages/string-collapse-white-space
