# object-delete-key

> Delete keys from all arrays or plain objects, nested within anything, by key or by value or by both, and clean up afterwards. Accepts wildcards.

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
- [Deleting](#deleting)
- [API](#api)
- [Example](#example)
- [Wildcards](#wildcards)
- [Rationale](#rationale)
- [This library vs. \_.omit](#this-library-vs-_omit)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i object-delete-key
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`deleteKey`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const deleteKey = require("object-delete-key");
```

or as an ES Module:

```js
import deleteKey from "object-delete-key";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/object-delete-key/dist/object-delete-key.umd.js"></script>
```

```js
// in which case you get a global variable "objectDeleteKey" which you consume like this:
const deleteKey = objectDeleteKey;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                            | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/object-delete-key.cjs.js` | 3 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/object-delete-key.esm.js` | 2 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/object-delete-key.umd.js` | 40 KB |

**[⬆ back to top](#)**

## Deleting

Three modes:

- Delete all `key`/`value` pairs found in any nested plain objects where `key` equals `value`.
- Delete all `key`/`value` pairs found in any nested plain objects where `key` is equal to a certain thing. `value` doesn't matter.
- Delete all `key`/`value` pairs found in any nested plain objects where `value` is equal to a certain thing. `key` doesn't matter.

This library accepts anything as input, including [parsed](https://github.com/posthtml/posthtml-parser) HTML, which is _deeply_ nested arrays of plain objects, arrays and strings. You can feed anything as input into this library - if it's traversable, it will be traversed and searched for your `key` and/or `value` in any plain objects.

If you want to delete any nested objects that contain certain `key`/`value` pair(s), check out [ast-delete-object](https://gitlab.com/codsen/codsen/tree/master/packages/ast-delete-object).

**[⬆ back to top](#)**

## API

```js
var result = deleteKey(input, options);
```

Input arguments are not mutated; this package clones them first before using.

### API - Input

| Input argument | Type     | Obligatory? | Description                                                     |
| -------------- | -------- | ----------- | --------------------------------------------------------------- |
| `input`        | Whatever | yes         | AST tree, or object or array or whatever. Can be deeply-nested. |
| `options`      | Object   | yes         | Options object. See its key arrangement below.                  |

| `options` object's key | Type     | Obligatory? | Default | Description                                                                                                                                                                                                                                                                                                                            |
| ---------------------- | -------- | ----------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                      |          |             |         |
| `key`                  | String   | no^         | n/a     | Key to find and delete.                                                                                                                                                                                                                                                                                                                |
| `val`                  | Whatever | no^         | n/a     | Key's value to find and delete. Can be a massively nested AST tree or whatever.                                                                                                                                                                                                                                                        |
| `cleanup`              | Boolean  | no          | true    | Should this package delete any empty carcases of arrays/objects left after deletion?                                                                                                                                                                                                                                                   |
| `only`                 | String   | no          | `any`   | Default setting will delete from both arrays and objects. If you want to delete from plain objects only, set this to one of "object-type" values below. If you want to delete keys from arrays only, set this to one of "array-type" values below. In this case "key" means array element's value and "value" is not meant to be used. |
| }                      |          |             |         |

^ - at least one, `key` or `val` must be present.

**[⬆ back to top](#)**

#### Accepted `opts.only` values

| Interpreted as "array-type" | Interpreted as "object-type" | Interpreted as "any" type |
| --------------------------- | ---------------------------- | ------------------------- |
| `array`                     | `object`                     | `any`                     |
| `arrays`                    | `objects`                    | `all`                     |
| `arr`                       | `obj`                        | `everything`              |
| `aray`                      | `ob`                         | `both`                    |
| `arr`                       | `o`                          | `either`                  |
| `a`                         |                              | `each`                    |
| <br/>                       |                              | `whatever`                |
| <br/>                       |                              | `e`                       |

If `opts.only` is set to any string longer than zero characters and is **not** case-insensitively equal to one of the above, the `object-delete-key` will **throw an error**.

I want to relieve users from having to check the documentation for `opts.only` values.

**[⬆ back to top](#)**

### API - Output

This library returns the `input` with all requested keys/value pairs removed.

## Example

```js
// deleting key 'c', with value 'd'
deleteKey(
  {
    a: "b",
    c: "d"
  },
  {
    key: "c",
    val: "d"
  }
);
// => {a: 'b'}
```

```js
// deleting key 'b' with value ['c', 'd']
// two occurencies will be deleted, plus empty objects/arrays deleted because 4th input is default, true
deleteKey(
  {
    a: { e: [{ b: ["c", "d"] }] },
    b: ["c", "d"]
  },
  {
    key: "b",
    val: ["c", "d"]
  }
);
// => {}
```

Feed options object's key `cleanup: false` if you **don't want** empty arrays/objects removed:

```js
// deleting key 'b' with value ['c', 'd']
// two occurencies will be deleted, but empty carcasses won't be touched:
deleteKey(
  {
    a: { e: [{ b: { c: "d" } }] },
    b: { c: "d" }
  },
  {
    key: "b",
    val: { c: "d" },
    cleanup: false
  }
);
// => {a: {e: [{}]}}
```

Also, you can delete by **key only**, for example, delete all key/value pairs where the key is equal to `b`:

```js
deleteKey(
  {
    a: "a",
    b: "jlfghdjkhkdfhgdf",
    c: [{ b: "weuhreorhelhgljdhflghd" }]
  },
  {
    key: "b"
  }
);
// => { a: 'a' }
```

You can delete by **value only**, for example, delete all key/value pairs where the value is equal to `whatever`:

```js
deleteKey(
  {
    a: "a",
    skldjfslfl: "x",
    c: [{ dlfgjdlkjlfgjhfg: "x" }]
  },
  {
    val: "x"
  }
);
// => { a: 'a' }
```

The example above didn't specified the `cleanup`, so this package _will_ delete all empty carcases of objects/arrays by default. When `cleanup` is off, the result would be this:

```js
deleteKey(
  {
    a: "a",
    skldjfslfl: "x",
    c: [{ dlfgjdlkjlfgjhfg: "x" }]
  },
  {
    val: "x",
    cleanup: false
  }
);
// => {
//   a: 'a',
//   c: [{}] // <<<< observe this
// }
```

**[⬆ back to top](#)**

## Wildcards

Wildcards can be used in keys and/or values. This library feeds inputs to [ast-monkey](https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey) which is doing all the heavy lifting, which, in turn, is using [matcher](https://github.com/sindresorhus/matcher).

```js
const res = deleteKey(
  {
    a: ["beep", "", "c", "boop"],
    bap: "bap"
  },
  {
    key: "b*p",
    only: "array"
  }
);
console.log(
  `${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(res, null, 4)}`
);
// => {
//      a: ['', 'c'],
//      bap: 'bap',
//    }
```

**[⬆ back to top](#)**

## Rationale

Object-key deletion libraries like [node-dropkey](https://github.com/wankdanker/node-dropkey) are naïve, expecting objects to be located in the input according to a certain pattern. For example, `node-dropkey` expects that the input will always be a flat array of plain objects.

But in real life, where we deal with AST _trees_ - nested _spaghetti_ of arrays, plain objects and strings — we can't expect anything. This library accepts _anything_ as an input, and no matter how deeply-nested. Feed it some nested AST's (`input`), then optionally a `key` or optionally a `value` (or both), and you'll get a result with that key/value pair removed from every plain object within the `input`.

I use this library in [email-comb](https://gitlab.com/codsen/codsen/tree/master/packages/email-comb) to delete empty carcases of style tags without any selectors or empty class attributes in the inline HTML CSS.

**[⬆ back to top](#)**

## This library vs. \_.omit

> OK, but if the input _is_ a plain object, you can achieve the same thing using Lodash `_.omit`, right?

Right, but ONLY if you don't care about the cleanup of empty arrays and/or plain objects afterwards.

Lodash will only delete keys that you ask, possibly leaving empty stumps.

This library will inteligently delete everything upstream if they're empty things (although you can turn it off passing `{ cleanup: false }` in `options` object).

Observe how key `b` _makes poof_, even though, technically, it was only a stump, having nothing to do with actual finding (besides being its parent):

```js
deleteKey(
  {
    a: "a",
    b: {
      c: "d"
    }
  },
  {
    key: "c"
  }
);
// =>
// {
//   a: 'a'
// }
```

Lodash won't clean up the stump `b`:

```js
_.omit(
  {
    a: "a",
    b: {
      c: "d"
    }
  },
  "c"
);
// =>
// {
//   a: 'a',
//   b: {} <------------------- LOOK!
// }
```

In conclusion, Lodash `_.omit` is different from this library in that:

- `_.omit` will not work on parsed HTML trees, consisting of nested arrays/plain objects
- `_.omit` will not clean up any stumps left after the deletion.

If you want to save time, `object-delete-key` is better than Lodash because former is _specialised tool for dealing with AST's_.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=object-delete-key%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aobject-delete-key%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=object-delete-key%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aobject-delete-key%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=object-delete-key%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aobject-delete-key%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/object-delete-key.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/object-delete-key
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/object-delete-key
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/object-delete-key
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/object-delete-key
[downloads-img]: https://img.shields.io/npm/dm/object-delete-key.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/object-delete-key
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/object-delete-key
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
