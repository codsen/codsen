# util-array-object-or-both

> Validate and normalise user choice: array, object or both?

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
- [API](#api)
- [Use](#use)
- [Critique](#critique)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i util-array-object-or-both
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`arrObjOrBoth`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const arrObjOrBoth = require("util-array-object-or-both");
```

or as an ES Module:

```js
import arrObjOrBoth from "util-array-object-or-both";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/util-array-object-or-both/dist/util-array-object-or-both.umd.js"></script>
```

```js
// in which case you get a global variable "utilArrayObjectOrBoth" which you consume like this:
const arrObjOrBoth = utilArrayObjectOrBoth;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                    | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/util-array-object-or-both.cjs.js` | 3 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/util-array-object-or-both.esm.js` | 2 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/util-array-object-or-both.umd.js` | 5 KB |

**[⬆ back to top](#)**

## Purpose

When I give the user ability to choose their preference out of: `array`, `object` or `any`, I want to:

- Allow users to input the preference in many ways: for example, for `array`, I also want to accept: `Arrays`, `add`, `ARR`, `a`. Similar thing goes for options `object` and `any`.
- Normalise the choice - recognise it and set it to one of the three following strings: `array`, `object` or `any`. This is necessary because we want set values to use in our programs. You can't have five values for `array` in an IF statement, for example.
- When a user sets the preference to unrecognised string, I want to `throw` a meaningful error message. Technically this will be achieved using an options object.
- Enforce lowercase and trim and input, to maximise the input possibilities

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

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

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

**[⬆ back to top](#)**

## Critique

You may ask, why on Earth you would need a package for a such thing? It's not very universal to be useful for society, is it?

Actually, it is.

I discovered that when working with AST's, you often need to tell your tools to process (traverse, delete, and so on) EITHER objects OR arrays or both. That's where this library comes in: standardise the choice (from three options) and relieve the user from the need to remember the exact value.

I think the API should accept a very wide spectrum of values, so users would not even need to check the API documentation - they'd just describe what they want, in plain English.

I'm going to use it in:

- [ast-monkey](https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey)
- [json-variables](https://gitlab.com/codsen/codsen/tree/master/packages/json-variables)
- [ast-delete-key](https://gitlab.com/codsen/codsen/tree/master/packages/ast-delete-key)

and others. So, it's not that niche as it might seem!

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=util-array-object-or-both%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Autil-array-object-or-both%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=util-array-object-or-both%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Autil-array-object-or-both%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=util-array-object-or-both%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Autil-array-object-or-both%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/util-array-object-or-both
[cov-img]: https://img.shields.io/badge/coverage-93.94%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/util-array-object-or-both
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/util-array-object-or-both
[downloads-img]: https://img.shields.io/npm/dm/util-array-object-or-both.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/util-array-object-or-both
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/util-array-object-or-both
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
