# string-collapse-white-space

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Efficient collapsing of white space with optional outer- and/or line-trimming and HTML tag recognition

[![Minimum Node version required][node-img]][node-url]
[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![Coverage][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![MIT License][license-img]][license-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [TLDR;](#tldr)
- [Install](#install)
- [The API](#the-api)
  - [Optional Options Object's API:](#optional-options-objects-api)
- [Algorithm](#algorithm)
- [Usage](#usage)
- [Smart bits](#smart-bits)
- [Practical use](#practical-use)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## TLDR;

Take string. First **trim** the outsides, then **collapse** two and more spaces into one.

`'    aaa    bbbb    '` → `'aaa bbbb'`

When trimming, any whitespace will be collapsed, including tabs, line breaks and so on.
When collapsing, _only spaces_ are collapsed. Non-space whitespace within text won't be collapsed.

`'   \t\t\t   aaa     \t     bbbb  \t\t\t\t  '` → `'aaa \t bbbb'`

(Optional, on by default) **Collapse** more aggressively within recognised **HTML tags**:

`'text <   span   >    contents   <  /  span   > more text'` → `'text <span> contents </span> more text'`

(Optional, off by default) **Trim** each line:

`'   aaa   \n   bbb   '` → `'aaa\nbbb'`

**[⬆ &nbsp;back to top](#)**

## Install

```bash
npm i string-collapse-white-space
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/string-collapse-white-space.cjs.js` | 18&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/string-collapse-white-space.esm.js` | 17&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/string-collapse-white-space.umd.js` | 46&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## The API

**collapse (string\[, opts])**

Input:
- the first argument - string only or will `throw`.
- the second argument - optional options object. Anything else than `undefined`, `null` or a plain object will `throw`.

Options object is sanitized by [check-types-mini](https://github.com/codsen/check-types-mini) which will `throw` if you set options' keys to wrong types or add unrecognized keys. You'll thank me later.

**[⬆ &nbsp;back to top](#)**

### Optional Options Object's API:

`options` object's key         | Type     | Obligatory? | Default     | Description
-------------------------------|----------|-------------|-------------|----------------------
{                              |          |             |             |
`trimStart`                    | Boolean  | no          | `true`      | if `false`, leading whitespace will be just collapsed. That might a single space, for example, if there are bunch of leading spaces.
`trimEnd`                      | Boolean  | no          | `true`      | if `false`, trailing whitespace will be just collapsed.
`trimLines`                    | Boolean  | no          | `false`     | if `true`, every line will be trimmed (spaces, tabs, line breaks of all kinds will be deleted, also non-breaking spaces, if `trimnbsp` is set to `true`)
`trimnbsp`                     | Boolean  | no          | `false`     | when trimming, do we delete non-breaking spaces (if set to `true`, answer would be "yes"). This setting also affects `trimLines` setting above.
`recogniseHTML`                | Boolean  | no          | `true`      | if `true`, the space directly within recognised 118 HTML tag brackets will be collapsed tightly: `< div >` → `<div>`. It will not touch any other brackets such as string `a > b`.
}                              |          |             |             |

**Defaults**:

```js
{
  trimStart: true,
  trimEnd: true,
  trimLines: false,
  trimnbsp: false,
  recogniseHTML: true
}
```

**[⬆ &nbsp;back to top](#)**

## Algorithm

Traverse the string once, gather a list of ranges indicating white space indexes, delete them all in one go and return the new string.

This library traverses the string _only once_ and performs the deletion _only once_. It recognises Windows, Unix and Linux line endings.

Optionally (on by default), it can recognise (X)HTML tags (any out of 118) and for example collapse `< div..` → `<div..`.

This algorithm **does not use regexes**.

**[⬆ &nbsp;back to top](#)**

## Usage

```js
const collapse = require('string-collapse-white-space')

let res1 = collapse('  aaa     bbb    ccc   dddd  ')
console.log('res1 = ' + res1)
// => "aaa bbb ccc dddd"

let res2 = collapse('   \t\t\t   aaa   \t\t\t   ')
console.log('res2 = ' + res2)
// => 'aaa'

let res3 = collapse('   aaa   bbb  \n    ccc   ddd   ', { trimLines: true })
console.log('res3 = ' + res3)
// => 'aaa bbb\nccc ddd'

// \xa0 is an unencoded non-breaking space:
let res4 = collapse(
  '     \xa0    aaa   bbb    \xa0    \n     \xa0     ccc   ddd   \xa0   ',
  { trimLines: true, trimnbsp: true }
)
console.log('res4 = ' + res4)
// => 'aaa bbb\nccc ddd'
```

**[⬆ &nbsp;back to top](#)**

## Smart bits

There are some sneaky false-positive cases, for example:

`Equations: a < b and c > d, for example.`

Notice the part `< b and c >` almost matches the HTML tag description - it's wrapped with brackets, starts with legit HTML tag name (one out of 118, for example, `b`) and even space follows it. The current version of the algorithm will detect false-positives by counting amount of space, equal, double quote and line break characters within suspected tag (string part between the brackets).

**The plan is**: if there are spaces, this means this suspect tag has got attributes. In that case, there has to be at least one equal sign or equal count of unescaped double quotes. Otherwise, nothing will be collapsed/deleted from that particular tag.

**[⬆ &nbsp;back to top](#)**

## Practical use

I want a reliable string white space collapsing library which would traverse the input ONLY ONCE and gather result IN ONE GO, before returning it. This is not regex approach where we mutate the string when trimming, then mutate again when collapsing... No. It's a proper traversal within a backward FOR loop (backward instead of forwards is for better speed), where we only gather the intel while traversing.

I'm going to use it first in [Detergent](https://github.com/codsen/detergent), but you never know, it might prove handy in email template building in general.

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/string-collapse-white-space/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/string-collapse-white-space/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/string-collapse-white-space/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-collapse-white-space.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-collapse-white-space

[npm-img]: https://img.shields.io/npm/v/string-collapse-white-space.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/string-collapse-white-space

[travis-img]: https://img.shields.io/travis/codsen/string-collapse-white-space.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/string-collapse-white-space

[cov-img]: https://coveralls.io/repos/github/codsen/string-collapse-white-space/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-collapse-white-space?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/string-collapse-white-space.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/string-collapse-white-space

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/string-collapse-white-space.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/string-collapse-white-space/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-collapse-white-space

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/string-collapse-white-space.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/string-collapse-white-space/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-collapse-white-space/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-collapse-white-space

[downloads-img]: https://img.shields.io/npm/dm/string-collapse-white-space.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-collapse-white-space

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-collapse-white-space

[license-img]: https://img.shields.io/npm/l/string-collapse-white-space.svg?style=flat-square
[license-url]: https://github.com/codsen/string-collapse-white-space/blob/master/license.md
