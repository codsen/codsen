# ast-delete-object

> Delete all plain objects that contain a certain key/value pair

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
- [Deleting](#deleting)
- [Match Keys Strictly setting](#match-keys-strictly-setting)
- [Hungry For White Space setting](#hungry-for-white-space-setting)
- [API](#api)
- [Example](#example)
- [The story](#the-story)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!-- prettier-ignore-end -->

If you want to delete only key/value pairs and **leave their parent objects alone**, see [ast-delete-key](https://github.com/codsen/ast-delete-key). It can delete key and or values from plain objects. Of course, those objects can be nested within anything. That's standard thing for `ast`-class libraries.

## Install

```bash
npm i ast-delete-object
```

```js
// consume via a CommonJS require():
const deleteObj = require("ast-delete-object");
// or import as an ES Module:
import deleteObj from "ast-delete-object";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                            | Size       |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------- | ---------- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ast-delete-object.cjs.js` | 2&nbsp;KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ast-delete-object.esm.js` | 2&nbsp;KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ast-delete-object.umd.js` | 32&nbsp;KB |

**[⬆ &nbsp;back to top](#)**

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

**[⬆ &nbsp;back to top](#)**

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

**[⬆ &nbsp;back to top](#)**

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

**[⬆ &nbsp;back to top](#)**

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

**[⬆ &nbsp;back to top](#)**

### API - Options object

| `options` object's key | Type    | Obligatory? | Default | Description                                                                                                                                                                                                                                                        |
| ---------------------- | ------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| {                      |         |             |         |
| `matchKeysStrictly`    | Boolean | no          | `false` | If you supplied an object to match, and all its keys were found in target object, that target object will be deleted. Now, there could have been extra keys there. If you set `matchKeysStrictly` to `true`, both **keysets** as well as key values have to match. |
| `hungryForWhitespace`  | Boolean | no          | `false` | When active, empty value (one which would get `trim`-med to empty string, `""`) will match any other empty value (which might be different matching strictly, yet `trim` to the same empty string, `""`).                                                          |
| }                      |         |             |         |

**[⬆ &nbsp;back to top](#)**

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

**[⬆ &nbsp;back to top](#)**

## The story

I used [posthtml-parser](https://github.com/posthtml/posthtml-parser) to parse some HTML and then deleted some objects from the AST trees on [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css) (deep-nested array of objects and arrays and strings). I wanted to delete empty tag objects and couldn't find a library that does this. That's how this library came to life.

Later I stopped parsing the HTML [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css), treating HTML code **as string**. This increased the speed of processing by magnitudes - what previously took a minute now takes miliseconds.

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/ast-delete-object/issues).

* If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/ast-delete-object/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/ast-delete-object.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ast-delete-object
[travis-img]: https://img.shields.io/travis/codsen/ast-delete-object.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/ast-delete-object
[cov-img]: https://coveralls.io/repos/github/codsen/ast-delete-object/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/ast-delete-object?branch=master
[overall-img]: https://img.shields.io/bithound/code/github/codsen/ast-delete-object.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/ast-delete-object
[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/ast-delete-object.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/ast-delete-object/master/dependencies/npm
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-delete-object
[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/ast-delete-object.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/ast-delete-object/master/dependencies/npm
[vulnerabilities-img]: https://snyk.io/test/github/codsen/ast-delete-object/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/ast-delete-object
[downloads-img]: https://img.shields.io/npm/dm/ast-delete-object.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-delete-object
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-delete-object
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-img]: https://img.shields.io/npm/l/ast-delete-object.svg?style=flat-square
[license-url]: https://github.com/codsen/ast-delete-object/blob/master/license.md
