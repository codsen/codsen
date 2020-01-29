# ast-delete-object

> Delete all plain objects that contain a certain key/value pair

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
- [Match Keys Strictly setting](#match-keys-strictly-setting)
- [Hungry For White Space setting](#hungry-for-white-space-setting)
- [API](#api)
- [Example](#example)
- [The story](#the-story)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i ast-delete-object
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`deleteObj`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const deleteObj = require("ast-delete-object");
```

or as an ES Module:

```js
import deleteObj from "ast-delete-object";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ast-delete-object/dist/ast-delete-object.umd.js"></script>
```

```js
// in which case you get a global variable "astDeleteObject" which you consume like this:
const deleteObj = astDeleteObject;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                            | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ast-delete-object.cjs.js` | 2 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ast-delete-object.esm.js` | 2 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ast-delete-object.umd.js` | 19 KB |

**[⬆ back to top](#)**

## Deleting

Sometimes you want to look for certain key/value pair in all nested objects, and if found, **delete the whole parent object**.

```js
const deleteObj = require("ast-delete-object");
let res = deleteObj(
  [
    // arg #1 - where to look
    "elem1",
    {
      findme1: "zzz",
      findme2: "yyy",
      somethingelse: "qqq"
    },
    "elem2"
  ],
  {
    // arg #2 - what to look for
    findme1: "zzz",
    findme2: "yyy"
  }
);
console.log("res = " + JSON.stringify(res, null, 4));
// => [
//      'elem1',
//      'elem2'
//    ]
```

**[⬆ back to top](#)**

## Match Keys Strictly setting

We have a dilemma: what to do regarding the **third key**, `somethingelse: 'qqq'`?

If you want the search to be strict, that is to require the key set to match exactly, use options object, `matchKeysStrictly: true`:

```js
const deleteObj = require("ast-delete-object");
let res = deleteObj(
  [
    "elem1",
    {
      findme1: "zzz",
      findme2: "yyy",
      somethingelse: "qqq"
    },
    "elem2"
  ],
  {
    findme1: "zzz",
    findme2: "yyy"
  },
  {
    matchKeysStrictly: true
  }
);
console.log("res = " + JSON.stringify(res, null, 4));
// => nothing changes!
// [
//   'elem1',
//   {
//     findme1: 'zzz',
//     findme2: 'yyy',
//     somethingelse: 'qqq'
//   },
//   'elem2'
// ]
```

**[⬆ back to top](#)**

## Hungry For White Space setting

This is a library to deal with AST's, and they usually have lots of white space. Often there are many elements that contains only spaces, tabs or line breaks. Sometimes we want to pretend that those elements containing white space don't exist, so deletion is more aggressive regarding the white space.

For example, notice how we look for blank plain object, but it catches other objects that contain only empty space:

```js
const deleteObj = require("ast-delete-object");
let res = deleteObj(
  [
    { a: "\n" },
    {
      key3: "val3",
      key4: "val4"
    },
    { b: "   " },
    { c: "" }
  ],
  {},
  { matchKeysStrictly: false, hungryForWhitespace: true }
);
console.log("res = " + JSON.stringify(res, null, 4));
// =>  [{
//      key3: 'val3',
//      key4: 'val4'
//    }]
```

**[⬆ back to top](#)**

## API

```js
deleteObj(input, objToDelete, strictOrNot);
```

### API - Input

| Input argument | Type     | Obligatory? | Description                                                     |
| -------------- | -------- | ----------- | --------------------------------------------------------------- |
| `input`        | Whatever | yes         | AST tree, or object or array or whatever. Can be deeply-nested. |
| `objToDelete`  | Whatever | yes         | Key/value pairs that should be used to match plain objects.     |
| `options`      | Boolean  | no          | OOO: Optional Options Object                                    |

By the way, the input arguments are not mutated in any way.

**[⬆ back to top](#)**

### API - Options object

| `options` object's key | Type    | Obligatory? | Default | Description                                                                                                                                                                                                                                                        |
| ---------------------- | ------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| {                      |         |             |         |
| `matchKeysStrictly`    | Boolean | no          | `false` | If you supplied an object to match, and all its keys were found in target object, that target object will be deleted. Now, there could have been extra keys there. If you set `matchKeysStrictly` to `true`, both **keysets** as well as key values have to match. |
| `hungryForWhitespace`  | Boolean | no          | `false` | When active, empty value (one which would get `trim`-med to empty string, `""`) will match any other empty value (which might be different matching strictly, yet `trim` to the same empty string, `""`).                                                          |
| }                      |         |             |         |

**[⬆ back to top](#)**

### API - Output

This library will return the same thing as argument `#1`, but with relevant elements deleted (or not).

## Example

Simple nested array/object:

`input`:

```js
[
  "elem1",
  {
    key2: "val2",
    key3: "val3",
    key4: "val4" // this key value pair will get deleted along with its parent object
  },
  "elem5"
];
```

`objToDelete`:

```js
{
  key2: 'val2',
  key3: 'val3'
}
```

result:

```js
["elem1", "elem5"];
```

If the mode is default, non-strict, this library will match things (object or array values or strings) containing only empty space (space character, line break or tab) agressively:

```js
delObj(
  [
    {
      x: "y"
    },
    {
      a: "a",
      b: ["\t\t\t \n\n\n"],
      c: "c"
    }
  ],
  {
    a: "a",
    b: [""]
  }
);
// => [{x: 'y'}]
```

Notice how key `a` contained a non-empty space character, so was matched exactly, but key `b` had only empty space. Since this was default non-strict mode (Boolean `true` missing as third argument), the third key `c` didn't even matter — both matched keys `a` and `b` was enough to get that plain object deleted.

Here's more of a real-life example:

```js
// require first:
const delObj = require('ast-delete-object')
...
// then, for example, delete empty style tag from PostHTML AST (parsed array/object-tree):
parsedHTMLObject = delObj(parsedHTMLObject, { 'tag': 'style', 'content': {} })
```

**[⬆ back to top](#)**

## The story

I used [posthtml-parser](https://github.com/posthtml/posthtml-parser) to parse some HTML and then deleted some objects from the AST trees on [email-comb](https://gitlab.com/codsen/codsen/tree/master/packages/email-comb) (deep-nested array of objects and arrays and strings). I wanted to delete empty tag objects and couldn't find a library that does this. That's how this library came to life.

Later I stopped parsing the HTML [email-comb](https://gitlab.com/codsen/codsen/tree/master/packages/email-comb), treating HTML code **as string**. This increased the speed of processing by magnitudes - what previously took a minute now takes milliseconds.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-delete-object%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-delete-object%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-delete-object%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-delete-object%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-delete-object%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-delete-object%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/ast-delete-object.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ast-delete-object
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-delete-object
[cov-img]: https://img.shields.io/badge/coverage-94.12%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-delete-object
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-delete-object
[downloads-img]: https://img.shields.io/npm/dm/ast-delete-object.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-delete-object
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-delete-object
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
