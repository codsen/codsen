# object-all-values-equal-to

> Does the AST/nested-plain-object/array/whatever contain only one kind of value?

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
- [API](#api)
- [Why we need this](#why-we-need-this)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i object-all-values-equal-to
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`allValuesEqualToWrapper`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const allValuesEqualToWrapper = require("object-all-values-equal-to");
```

or as an ES Module:

```js
import allValuesEqualToWrapper from "object-all-values-equal-to";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/object-all-values-equal-to/dist/object-all-values-equal-to.umd.js"></script>
```

```js
// in which case you get a global variable "objectAllValuesEqualTo" which you consume like this:
const allValuesEqualToWrapper = objectAllValuesEqualTo;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                     | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/object-all-values-equal-to.cjs.js` | 3 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/object-all-values-equal-to.esm.js` | 2 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/object-all-values-equal-to.umd.js` | 12 KB |

**[⬆ back to top](#)**

## Purpose

It answers the question: does the given AST/nested-plain-object/array/whatever contain only one kind of value?

The equality is not explicit, that is, we're just checking, that all values are **not unequal** to the given-one.

For example:

```js
const allValuesEqualTo = require("object-all-values-equal-to");

// are all values equal to "false":
console.log(allValuesEqualTo({ a: false, c: false }, false));
// => true

// are all values equal to "false":
console.log(allValuesEqualTo({ a: false, c: "zzz" }, false));
// => false, because of `zzz`

// are all values equal to "false":
console.log(
  allValuesEqualTo(
    {
      a: {
        b: false,
        c: [
          {
            d: false,
            e: false
          },
          {
            g: false
          }
        ]
      },
      c: false
    },
    false
  )
);
// => true
```

**[⬆ back to top](#)**

### `opts.arraysMustNotContainPlaceholders`

When working with data structures, this library would be used to check, is the certain piece of JSON data (some key's value, a nested object) is all blank, that is, contains only placeholders everywhere.

Now, with regards to arrays, default arrays should not contain placeholders directly. For example key `b` is customised, it's not a placeholder:

```json
{
  "a": false,
  "b": [false]
}
```

It should be instead:

```json
{
  "a": false,
  "b": []
}
```

When checking against second argument `false`, this library will yield `false` for former and `true` for latter.

Now, this is relevant only when working with data structures. When dealing with all other kinds of nested objects and arrays, placeholders within arrays count as placeholders and should yield `true`.

For that, turn off the `opts.arraysMustNotContainPlaceholders`, set it to `false`.

Observe:

```js
let res1 = allValuesEqualTo([null], null);
console.log(res1);
// => false

let res2 = allValuesEqualTo([null], null, {
  arraysMustNotContainPlaceholders: false
});
console.log(res2);
// => true
```

**[⬆ back to top](#)**

## API

```js
allValuesEqualTo(input, value);
```

### API - Input

| Input argument | Type     | Obligatory? | Default     | Description                                                                                                                                 |
| -------------- | -------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`        | Whatever | yes         | `undefined` | AST tree, or object or array or whatever. Can be deeply-nested. Hopefully contains some nested plain objects. We love nested plain objects. |
| `value`        | Whatever | no          | `false`     | We will check, does `input` contain only `value` on every key. Please don't set it to `undefined`.                                          |

**[⬆ back to top](#)**

### Optional Options Object

| options object's key               | Type of its value | Default | Description                                                                                                                                                                    |
| ---------------------------------- | ----------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| {                                  |                   |         |
| `arraysMustNotContainPlaceholders` | Boolean           | `true`  | When set to `true`, `value` within array should not be present and will yield `false` result. Set this to `false` to allow one or more `value`'s within arrays in the `input`. |
| }                                  |                   |         |

Here are the Optional Options Object's defaults in one place (in case you ever want to copy and tweak it):

```js
{
  arraysMustNotContainPlaceholders: true,
}
```

**[⬆ back to top](#)**

### API - Output

Boolean: `true` or `false`.

## Why we need this

For example, I was working on [object-fill-missing-keys](https://gitlab.com/codsen/codsen/tree/master/packages/object-fill-missing-keys). The library takes an object, a reference object, and fills in missing keys according to the reference. I was implementing a feature, a options switch, which let to skip filling for chosen keys if they currently contain only placeholders.

You'll need this library when you want to check, does the AST contain only certain value throughout the whole tree. Also, it can be a simple object, in which case, we'd be checking, are all values of all keys equal to something.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=object-all-values-equal-to%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aobject-all-values-equal-to%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=object-all-values-equal-to%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aobject-all-values-equal-to%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=object-all-values-equal-to%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aobject-all-values-equal-to%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/object-all-values-equal-to.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/object-all-values-equal-to
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/object-all-values-equal-to
[cov-img]: https://img.shields.io/badge/coverage-94.87%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/object-all-values-equal-to
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/object-all-values-equal-to
[downloads-img]: https://img.shields.io/npm/dm/object-all-values-equal-to.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/object-all-values-equal-to
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/object-all-values-equal-to
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
