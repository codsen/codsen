# object-no-new-keys

> Check, does a plain object (AST/JSON) has any unique keys, not present in a reference object (another AST/JSON)

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![no dependencies][no-deps-img]][no-deps-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [API](#api)
- [Two modes](#two-modes)
- [For example](#for-example)
- [Competition](#competition)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i object-no-new-keys
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`nnk`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const nnk = require("object-no-new-keys");
```

or as an ES Module:

```js
import nnk from "object-no-new-keys";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/object-no-new-keys/dist/object-no-new-keys.umd.js"></script>
```

```js
// in which case you get a global variable "objectNoNewKeys" which you consume like this:
const nnk = objectNoNewKeys;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                             | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/object-no-new-keys.cjs.js` | 4 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/object-no-new-keys.esm.js` | 3 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/object-no-new-keys.umd.js` | 2 KB |

**[⬆ back to top](#)**

## Idea

Check, does a `given thing` (probably a nested plain object) have any keys, not present in a `reference thing` (probably an another nested plain object). I'm using a term "thing" because this library uses a recursive algorithm which means both inputs can be _whatever_-type (string, plain object or an array).

This library will try to perform a **deep, recursive traversal** of both inputs and will not mutate the input arguments.

It is meant for work with AST's, parsed HTML or JSON, the cases where there are _objects within arrays within objects_.

Personally, I use this library to look for any rogue keys in email template content files, in JSON format.

**[⬆ back to top](#)**

## API

**nnk(input, reference\[, opts])** - in other words, it's a function which takes two obligatory arguments and third, optional.

### API - Function's Input

| Function's argument                                                                                                                                                                  | Key value's type                                                                                         | Obligatory? | Description        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ----------- | ------------------ |
| `input`                                                                                                                                                                              | Normally, a plain object or array — but can be whatever in which case the results will be an empty array | yes         | What to work upon. |
| `reference | Same, normally, a plain object or array — but can be whatever type in which case result will be empty array | yes | The reference against which we'll match the`input`. |
| `opts | Plain object | no | Optional options object                                                                                                                                  |

**[⬆ back to top](#)**

### API - Function's Output

Returns an array of zero or more paths to each key/element in the `input` which does not exist in `reference`.

### API - `opts` - an Optional Options Object

**Defaults**:

```js
{
  mode: 2;
}
```

| Optional Options Object's key | Type           | Obligatory? | Default | Description                         |
| ----------------------------- | -------------- | ----------- | ------- | ----------------------------------- |
| {                             |                |             |         |
| `mode`                        | Integer number | no          | `2`     | Choose mode: `1` or `2`. See below. |
| {                             |                |             |         |

**[⬆ back to top](#)**

## Two modes

This library has two modes:

1.  Strict comparing, having no assumptions about the `reference`.
2.  Comparing, assuming that the `reference` will be NORMALISED.

By "_normalised_" I mean if any arrays have object children, those objects have the same keys.

These two modes mainly concern the case when both `input` and `reference` have an array, but `reference` has fewer elements and there's nothing to compare the `input` element to:

```js
const input = {
  a: [
    {
      // object number 1
      b: "b1",
      c: "c1"
    },
    {
      // object number 2
      b: "b2",
      c: "c2",
      x: "y"
    }
  ]
};

const reference = {
  a: [
    {
      // << just one object!
      b: "b3",
      c: "c3"
    }
  ]
};
```

First mode will report that `a[1].b` and `a[1].c` and `a[1].x` are all rogue keys, not present in `reference.`

The second mode will anticipate that `reference` will be normalised, that is, we can **compare input array elements to the first element of an array in reference**. We'll get the same thing — all objects within an array should have the same keys. This means, `input` has only one rogue key — `a[1].x`. And algorithm will identify it by comparing `input` object `a[1]` to `reference` object `a[0]` — second/third/whatever element in the `input` to **ALWAYS THE FIRST ELEMENT IN REFERENCE**, `a[0]`.

I need the second mode, but I give people chance to use the first mode as well. Maybe somebody will find it useful.

**[⬆ back to top](#)**

## For example

```js
const nnk = require("object-no-new-keys");
const res = nnk(
  {
    a: "a",
    b: "b",
    c: "c"
  },
  {
    c: "z"
  }
);
console.log("nnk = " + JSON.stringify(nnk, null, 4));
// => ['a', 'b']
// meaning, path "a" and path "b" were missing
// path notation uses [] to mark array's contents
```

works with arrays too:

```js
const nnk = require("object-no-new-keys");
const res = nnk(
  {
    //<<< input
    a: [
      {
        b: "aaa",
        d: "aaa", // rogue key, record it
        f: "fff" // another rogue key, record it
      },
      {
        c: "aaa",
        k: "kkk" // yet another rogue key, record it
      }
    ],
    x: "x" // rogue too
  },
  {
    // <<< reference
    a: [
      {
        b: "bbb",
        c: "ccc"
      },
      {
        b: "yyy",
        c: "zzz"
      }
    ]
  }
);
console.log("res = " + JSON.stringify(res, null, 4));
// => ['a[0].d', 'a[0].f', 'a[1].k', 'x']
```

**[⬆ back to top](#)**

## Competition

You could try to use a [missing-deep-keys](https://github.com/vladgolubev/missing-deep-keys), but it won't work if your inputs have **arrays**. For posterity, the algorithm of it is quite wise: run `lodash.difference` against [deep-keys](https://www.npmjs.com/package/deep-keys)-flattened stringified key schemas of both object and reference. However, `deep-keys` does not support **arrays**, so it's not that easy.

In short, `missing-deep-keys` is for cases when you have only objects-within-objects. `object-no-new-keys` is for work with parsed HTML (AST's) or JSON. Higher-end.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=object-no-new-keys%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aobject-no-new-keys%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=object-no-new-keys%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aobject-no-new-keys%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=object-no-new-keys%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aobject-no-new-keys%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/object-no-new-keys
[cov-img]: https://img.shields.io/badge/coverage-92.86%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/object-no-new-keys
[no-deps-img]: https://img.shields.io/badge/-no%20dependencies-brightgreen?style=flat-square
[no-deps-url]: https://www.npmjs.com/package/object-no-new-keys?activeTab=dependencies
[downloads-img]: https://img.shields.io/npm/dm/object-no-new-keys.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/object-no-new-keys
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/object-no-new-keys
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
