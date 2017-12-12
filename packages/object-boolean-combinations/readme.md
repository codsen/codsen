# object-boolean-combinations

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Generate an array full of object copies, each containing a unique Boolean value combination. Includes overrides.

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


- [Install](#install)
- [What it does](#what-it-does)
- [API](#api)
  - [API - Input](#api---input)
- [Overriding](#overriding)
- [Overriding the combinations — in practice](#overriding-the-combinations--in-practice)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
npm i object-boolean-combinations
```

```js
// consume as a CommonJS require:
const objectBooleanCombinations = require('object-boolean-combinations')
// or as an ES Module:
import objectBooleanCombinations from 'object-boolean-combinations'
```

## What it does

It consumes a plain object, takes its keys (values don't matter) and produces an array with every possible combination of each key's Boolean^ value. If you have _n_ keys, you'll get `2^n` objects in the resulting array.

```js
const objectBooleanCombinations = require('object-boolean-combinations')
const test = objectBooleanCombinations({ a: 'whatever' })
console.log(`test = ${JSON.stringify(test, null, 4)}`)
// => [
//      {a: 0},
//      {a: 1}
//    ]
```

^ We could generate `true`/`false` values, but for efficiency, we're generating `0`/`1` instead. Works the same in Boolean logic, but takes up less space.

PS. Observe how input values don't matter, we had: `{ a: 'whatever' }`.

Sometimes, you don't want all the combinations, you might want to "pin" certain values to be constant across all combinations. In those cases, use [overrides](#overriding), see below.

## API

```javascript
objectBooleanCombinations(inputObject, [overrideObject]);
```

### API - Input

Input argument           | Type           | Obligatory? | Description
-------------------------|----------------|-------------|-------------
`inputObject`            | Plain object   | yes         | Plain object from which we should reference the keys.
`overrideObject`         | Plain object   | no          | Keys in this object will be used as-is and will not be used for generating combinations. See [overriding](#overriding) section below.

**[⬆ &nbsp;back to top](#)**

## Overriding

Sometimes you want to override the object keys, for example, in the a settings object, I want to override all `a` and `b` keys to be only `true` (`1`). This reduces the object combinations from `2^3 = 8` to: `2^(3-2) = 2^1 = 2`:

```js
const objectBooleanCombinations = require('object-boolean-combinations')
const test = objectBooleanCombinations(
  {a: 0, b: 0, c: 0},
  {a: 1, b: 1} // <---- Override. These values will be on all combinations.
)
console.log(`test = ${JSON.stringify(test, null, 4)}`)
// => [
//      {a: 1, b: 1, c: 0},
//      {a: 1, b: 1, c: 1}
//    ]
```

In example above, `a` and `b` are "pinned" to `1`, thus reducing the amount of combinations by power of two, essentially halving resulting objects count twice. Notice how only `c` is having variations.

**[⬆ &nbsp;back to top](#)**

## Overriding the combinations — in practice

In practice, I use this overriding to perform the specific tests on [Detergent.js](https://github.com/codsen/detergent). For example, let's say, I am testing: does Detergent encode entities correctly. In that case I need two arrays filled with objects:
* first array — `encodeEntities = true` and all possible combinations of the other 9 settings (2^(10-1)=512 objects in array)
* second array — `encodeEntities = false` and all possible combinations of the rest — again 512 objects in array.

Here's an AVA test, which uses `objectBooleanCombinations()` to create a combinations array of settings objects, then uses `forEach()` to iterate through them all, testing each:

```js
test('encode entities - pound sign', t => {
  objectBooleanCombinations(sampleObj, {
    convertEntities: true
    })
  .forEach(function (elem){
    t.is(detergent(
      '\u00A3', elem),
      '&pound;',
      'pound char converted into entity'
    )
  })
})
```

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/object-boolean-combinations/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/object-boolean-combinations/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give an advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/object-boolean-combinations/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/object-boolean-combinations.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/object-boolean-combinations

[npm-img]: https://img.shields.io/npm/v/object-boolean-combinations.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/object-boolean-combinations

[travis-img]: https://img.shields.io/travis/codsen/object-boolean-combinations.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/object-boolean-combinations

[cov-img]: https://coveralls.io/repos/github/codsen/object-boolean-combinations/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/object-boolean-combinations?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/object-boolean-combinations.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/object-boolean-combinations

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/object-boolean-combinations.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/object-boolean-combinations/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/object-boolean-combinations

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/object-boolean-combinations.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/object-boolean-combinations/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/object-boolean-combinations/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/object-boolean-combinations

[downloads-img]: https://img.shields.io/npm/dm/object-boolean-combinations.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/object-boolean-combinations

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/object-boolean-combinations

[license-img]: https://img.shields.io/npm/l/object-boolean-combinations.svg?style=flat-square
[license-url]: https://github.com/codsen/object-boolean-combinations/blob/master/license.md
