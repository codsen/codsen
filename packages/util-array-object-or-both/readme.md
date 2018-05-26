# util-array-object-or-both

> Validate and normalise user choice: array, object or both?

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
- [API](#api)
- [Use](#use)
- [Critique](#critique)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!-- prettier-ignore-end -->

## Install

```bash
npm i util-array-object-or-both
```

```js
// consume via a CommonJS require:
const arrObjOrBoth = require("util-array-object-or-both");
// or as an ES Module:
import arrObjOrBoth from "util-array-object-or-both";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                    | Size       |
| ------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------------------- | ---------- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/util-array-object-or-both.cjs.js` | 3&nbsp;KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/util-array-object-or-both.esm.js` | 2&nbsp;KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/util-array-object-or-both.umd.js` | 17&nbsp;KB |

**[⬆ &nbsp;back to top](#)**

## Purpose

When I give the user ability to choose their preference out of: `array`, `object` or `any`, I want to:

* Allow users to input the preference in many ways: for example, for `array`, I also want to accept: `Arrays`, `add`, `ARR`, `a`. Similar thing goes for options `object` and `any`.
* Normalise the choice - recognise it and set it to one of the three following strings: `array`, `object` or `any`. This is necessary because we want set values to use in our programs. You can't have five values for `array` in an IF statement, for example.
* When a user sets the preference to unrecognised string, I want to `throw` a meaningful error message. Technically this will be achieved using an options object.
* Enforce lowercase and trim and input, to maximise the input possibilities

| <br>               | Assumed to be an array-type | object-type | either type  |
| ------------------ | --------------------------- | ----------- | ------------ |
| **Input string:**  | `array`                     | `object`    | `any`        |
| <br>               | `arrays`                    | `objects`   | `all`        |
| <br>               | `arr`                       | `obj`       | `everything` |
| <br>               | `aray`                      | `ob`        | `both`       |
| <br>               | `arr`                       | `o`         | `either`     |
| <br>               | `a`                         |             | `each`       |
| <br>               |                             |             | `whatever`   |
| <br>               |                             |             | `e`          |
| <br>               | `----`                      | `----`      | `----`       |
| **Output string:** | `array`                     | `object`    | `any`        |

**[⬆ &nbsp;back to top](#)**

## API

API is simple - just pass your value through this library's function. If it's valid, it will be normalised to either `array` or `object` or `any`. If it's not valid, an error will be thrown.

| Input argument | Type         | Obligatory? | Description                                                                 |
| -------------- | ------------ | ----------- | --------------------------------------------------------------------------- |
| `input`        | String       | yes         | Let users choose from variations of "array", "object" or "both". See above. |
| `opts`         | Plain object | no          | Optional Options Object. See below for its API.                             |

Options object lets you customise the `throw`n error message. It's format is the following:

    ${opts.msg}The ${opts.optsVarName} was customised to an unrecognised value: ${str}. Please check it against the API documentation.

| `options` object's key | Type   | Obligatory? | Default                                               | Description                                    |
| ---------------------- | ------ | ----------- | ----------------------------------------------------- | ---------------------------------------------- |
| {                      |        |             |                                                       |
| `msg`                  | String | no          | `` | Append the message in front of the thrown error. |
| `optsVarName`          | String | no          | `given variable`                                      | The name of the variable we are checking here. |
| }                      |        |             |                                                       |

For example, set `optsVarName` to `opts.only` and set `msg` to `ast-delete-key/deleteKey(): [THROW_ID_01]` and the error message `throw`n if user misconfigures the setting will be, for example:

    ast-delete-key/deleteKey(): [THROW_ID_01] The variable "opts.only" was customised to an unrecognised value: sweetcarrots. Please check it against the API documentation.

**[⬆ &nbsp;back to top](#)**

## Use

```js
// require this library:
const arrObjOrBoth = require('util-array-object-or-both')
// and friends:
const clone = require('lodash.clonedeep')
const checkTypes = require('check-types-mini')
const objectAssign = require('object-assign')
// let's say you have a function:
function myPrecious (input, opts) {
  // now you want to check your options object, is it still valid after users have laid their sticky paws on it:
  // define defaults:
  let defaults = {
    lalala: null,
    only: 'object' // <<< this is the value we're particularly keen to validate, is it `array`|`object`|`any`
  }
  // clone the defaults to safeguard it, and then, object-assign onto defaults.
  // basically you fill missing values with default-ones
  opts = objectAssign(clone(defaults), opts)
  // now, use "check-types-mini" to validate the types:
  checkTypes(opts, defaults,
    {
      // give a meaningful message in case it throws,
      // customise the library `check-types-mini`:
      msg: 'my-library/myPrecious(): [THROW_ID_01]',
      optsVarName: 'opts',
      schema: {
        lalala: ['null', 'string'],
        only: ['null', 'string']
      }
    }
  )
  // by this point, we can guarantee that opts.only is either `null` or `string`.
  // if it's a `string`, let's validate is its values among accepted-ones:
  opts.only = arrObjOrBoth(opts.only, {
    msg: 'my-library/myPrecious(): [THROW_ID_02]',
    optsVarName: 'opts.only'
  })
  // now we can guarantee that it's either falsey (undefined or null) OR:
  //   - `object`
  //   - `array`
  //   - `any`

  // now you can use `opts.only` in your function safely.
  ...
  // rest of the function...
}
```

**[⬆ &nbsp;back to top](#)**

## Critique

You may ask, why on Earth you would need a package for such thing? It's not very universal to be useful for society, is it?

Actually, it is.

I discovered that when working with AST's, you often need to tell your tools to process (traverse, delete, and so on) EITHER objects OR arrays or both. That's where this library comes in: standardise the choice (from three options) and relieve the user from the need to remember the exact value.

I think the API should accept a very wide spectrum of values, so users would not even need to check the API documentation - they'd just describe what they want, in plain English.

I'm going to use it in:

* [ast-monkey](https://github.com/codsen/ast-monkey)
* [json-variables](https://github.com/codsen/json-variables)
* [ast-delete-key](https://github.com/codsen/ast-delete-key)

and others. So, it's not that niche as it might seem!

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/util-array-object-or-both/issues).

* If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/util-array-object-or-both/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/util-array-object-or-both.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/util-array-object-or-both
[travis-img]: https://img.shields.io/travis/codsen/util-array-object-or-both.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/util-array-object-or-both
[cov-img]: https://coveralls.io/repos/github/codsen/util-array-object-or-both/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/util-array-object-or-both?branch=master
[overall-img]: https://img.shields.io/bithound/code/github/codsen/util-array-object-or-both.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/util-array-object-or-both
[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/util-array-object-or-both.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/util-array-object-or-both/master/dependencies/npm
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/util-array-object-or-both
[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/util-array-object-or-both.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/util-array-object-or-both/master/dependencies/npm
[vulnerabilities-img]: https://snyk.io/test/github/codsen/util-array-object-or-both/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/util-array-object-or-both
[downloads-img]: https://img.shields.io/npm/dm/util-array-object-or-both.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/util-array-object-or-both
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/util-array-object-or-both
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-img]: https://img.shields.io/npm/l/util-array-object-or-both.svg?style=flat-square
[license-url]: https://github.com/codsen/util-array-object-or-both/blob/master/license.md
