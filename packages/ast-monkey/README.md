# ast-monkey

> Utility library for ops on parsed HTML (AST's) or anything nested (plain objects within arrays within plain objects)

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

- If you only need traversal function, install just it: [ast-monkey-traverse](https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-traverse)

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [API](#api)
- [The name of this library](#the-name-of-this-library)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i ast-monkey
```

Consume via a `require()`:

```js
const {
  find,
  get,
  set,
  drop,
  info,
  del,
  arrayFirstOnly,
  traverse
} = require("ast-monkey");
```

or as an ES Module:

```js
import {
  find,
  get,
  set,
  drop,
  info,
  del,
  arrayFirstOnly,
  traverse
} from "ast-monkey";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ast-monkey/dist/ast-monkey.umd.js"></script>
```

```js
// in which case you get a global variable "astMonkey" which you consume like this:
const { find, get, set, drop, info, del, arrayFirstOnly, traverse } = astMonkey;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                     | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------ | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ast-monkey.cjs.js` | 10 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ast-monkey.esm.js` | 10 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ast-monkey.umd.js` | 42 KB |

**[⬆ back to top](#)**

## Idea

The main purpose of this library is to do operations on parsed HTML, but more and more I'm [using](#traverse) it everywhere else where I have nested arrays and/or plain objects.

Working with parsed HTML (AST trees) is hard when you want to go "up" the branches because "AST-walking" algorithms usually just go through all the nodes, from the first one to the last one.

`ast-monkey`'s primary purpose is to help in those cases when you want to go _up the branches_ — to be able to query what is the current node's parent (and optionally all the way up).

`ast-monkey`'s secondary purpose is to give us a reliable, tested [traversal function](#traverse), so you don't have to write yours each time. I took the idea from PostHTML traversal but rewrote it adding more powerful features (such as reporting the current depth in the AST).

`ast-monkey` algorithm assigns indexes to every traversed node so that you can visit it again. Also, [.find()](#find) will record the "bread crumb"-style indexes path to each found node. This, combined with [.get()](#get) function allows you to traverse the tree "up", from the found child node up all the way until its topmost parent node is reached.

Using this library, you can delete the particular piece of AST (method [.drop()](#drop)) or overwrite (method [.set()](#set)). You can also perform searches by object's/array's `key`, `value` or both (method [.find()](#find)). You can retrieve all contents of any piece of AST by index (method [.get()](#get)) or list all indexes (method [.info()](#info)).

Alternatively, you can tap into the core of the monkey, the [.traverse()](#traverse) function and save yourself the trouble writing recursive walk-through functions - the [.traverse()](#traverse) will walk through every single element of an array or key of an object, giving you the current thing via the familiar callback function interface (just like `Array.forEach` or `Array.map`).

**[⬆ back to top](#)**

## API

### .find()

Method `find()` can search objects by key or by value or by both and return the indexes path to an each finding.

---

**Input**

| Input argument | Type     | Obligatory? | Description                                                     |
| -------------- | -------- | ----------- | --------------------------------------------------------------- |
| `input`        | Whatever | yes         | AST tree, or object or array or whatever. Can be deeply-nested. |
| `options`      | Object   | yes         | Options object. See below.                                      |

| Options object's key | Type     | Obligatory?                              | Description                                                                                                                |
| -------------------- | -------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| {                    |          |                                          |
| `key`                | String   | at least one, `key` or `val`             | If you want to search by a plain object's key, put it here.                                                                |
| `val`                | Whatever | at least one, `key` or `val`             | If you want to search by a plain object's value, put it here.                                                              |
| `only`               | String   | no (if not given, will default to `any`) | You can specify, to find only within arrays, objects or any. `any` is default and will be set if `opts.only` is not given. |
| }                    |          |                                          |

Either `opts.key` or `opts.val` or both must be present. If both are missing, `ast-monkey` will throw an error.

`opts.only` is validated via dedicated package, [util-array-object-or-both](https://gitlab.com/codsen/codsen/tree/master/packages/util-array-object-or-both). Here are the permitted values for `opts.only`, case-insensitive:

| Either type  | Interpreted as array-type | Interpreted as object-type |
| ------------ | ------------------------- | -------------------------- |
| `any`        | `array`                   | `object`                   |
| `all`        | `arrays`                  | `objects`                  |
| `everything` | `arr`                     | `obj`                      |
| `both`       | `aray`                    | `ob`                       |
| `either`     | `arr`                     | `o`                        |
| `each`       | `a`                       |
| `whatever`   |                           |
| `e`          |                           |

If `opts.only` is set to any string longer than zero characters and is not case-insensitively equal to one of the above, the `ast-monkey` will throw an error.

**Output**

The output will be an array, comprising of zero or more plain objects in the following format:

| Object's key | Type             | Description                                                                                                                                                      |
| ------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {            |                  |
| `index`      | Integer number   | The index of the finding. It's also the last element of the `path` array.                                                                                        |
| `key`        | String           | The found object's key                                                                                                                                           |
| `val`        | Whatever or Null | The found object's value (or `null` if it's a key of an array)                                                                                                   |
| `path`       | Array            | The found object's path: indexes of all its parents, starting from the topmost. The found key/value pair's address will be the last element of the `path` array. |
| }            |                  |

If a finding is an element of an array, the `val` will be set to `null`.

**Use example**

Find out, what is the path to the key that equals 'b'.

```js
const {
  find,
  get,
  set,
  drop,
  info,
  del,
  arrayFirstOnly,
  traverse
} = require("ast-monkey");
const input = ["a", [["b"], "c"]];
const key = "b";
const result = find(input, { key: key });
console.log("result = " + JSON.stringify(result, null, 4));
// => [
//      {
//        index: 4,
//        key: 'b',
//        val: null,
//        path: [2, 3, 4]
//      }
//    ]
```

Once you know that the path is `[2, 3, 4]`, you can iterate its parents, `get()`-ing indexes number `3` and `2` and perform operations on it. The last element in the findings array is the finding itself.

This method is the most versatile of the `ast-monkey` because you can go "up the AST tree" by querying its array elements backwards.

**[⬆ back to top](#)**

### .get()

Use method `get()` to query AST trees by branch's index (a numeric id). You would get that index from a previously performed `find()` or you can pick a number manually, possibly choosing one of the indexes from `info()` output.

Practically, `get()` is typically used on each element of the findings array (which you would get after performing `find()`). Then, depending on your needs, you would write the particular index over using `set()` or delete it using `drop()`.

---

**Input**

| Input argument | Type     | Obligatory? | Description                                                     |
| -------------- | -------- | ----------- | --------------------------------------------------------------- |
| `input`        | Whatever | yes         | AST tree, or object or array or whatever. Can be deeply-nested. |
| `options`      | Object   | yes         | Options object. See below.                                      |

| Options object | Type                       | Obligatory? | Description                                                           |
| -------------- | -------------------------- | ----------- | --------------------------------------------------------------------- |
| {              |                            |             |
| `index`        | Number or number-as-string | yes         | Index number of piece of AST you want the monkey to retrieve for you. |
| }              |                            |             |

**Output**

The `get()` returns object, array or `null`, depending what index was matched (or not).

**Use example**

If you know that you want an index number two, you can query it using `get()`:

```js
const {
  find,
  get,
  set,
  drop,
  info,
  del,
  arrayFirstOnly,
  traverse
} = require("ast-monkey");
const input = {
  a: {
    b: "c"
  }
};
const index = 2;
const result = get(input, { index: index });
console.log("result = " + JSON.stringify(result, null, 4));
// => {
//      b: 'c'
//    }
```

In practice, you would query a list of indexes programmatically using a `for` loop.

**[⬆ back to top](#)**

### .set()

Use method `set()` to overwrite a piece of an AST when you know its index.

---

**Input**

| Input argument | Type     | Obligatory? | Description                                                     |
| -------------- | -------- | ----------- | --------------------------------------------------------------- |
| `input`        | Whatever | yes         | AST tree, or object or array or whatever. Can be deeply-nested. |
| `options`      | Object   | yes         | Options object. See below.                                      |

| Options object | Type                       | Obligatory? | Description                                   |
| -------------- | -------------------------- | ----------- | --------------------------------------------- |
| {              |                            |             |
| `index`        | Number or number-as-string | yes         | Index of the piece of AST to find and replace |
| `val`          | Whatever                   | yes         | Value to replace the found piece of AST with  |
| }              |                            |             |

**Output**

| Output  | Type          | Description         |
| ------- | ------------- | ------------------- |
| `input` | Same as input | The amended `input` |

**Use example**

Let's say you identified the `index` of a piece of AST you want to write over:

```js
const {
  find,
  get,
  set,
  drop,
  info,
  del,
  arrayFirstOnly,
  traverse
} = require("ast-monkey");
const input = {
  a: { b: [{ c: { d: "e" } }] },
  f: { g: ["h"] }
};
const index = "7";
const val = "zzz";
const result = set(input, { index: index, val: val });
console.log("result = " + JSON.stringify(result, null, 4));
// => {
//      a: {b: [{c: {d: 'e'}}]},
//      f: {g: 'zzz'}
//    }
```

**[⬆ back to top](#)**

### .drop()

Use method `drop()` to delete a piece of an AST with a known index.

---

**Input**

| Input argument | Type     | Obligatory? | Description                                                     |
| -------------- | -------- | ----------- | --------------------------------------------------------------- |
| `input`        | Whatever | yes         | AST tree, or object or array or whatever. Can be deeply-nested. |
| `options`      | Object   | yes         | Options object. See below.                                      |

| Options object's key | Type                       | Obligatory? | Description                                                         |
| -------------------- | -------------------------- | ----------- | ------------------------------------------------------------------- |
| {                    |                            |             |
| `index`              | Number or number-as-string | yes         | Index number of piece of AST you want the monkey to delete for you. |
| }                    |                            |             |

**Output**

| Output  | Type            | Description         |
| ------- | --------------- | ------------------- |
| `input` | Same as `input` | The amended `input` |

**Use example**

Let's say you want to delete the piece of AST with an index number 8. That's `'h'`:

```js
const {
  find,
  get,
  set,
  drop,
  info,
  del,
  arrayFirstOnly,
  traverse
} = require("ast-monkey");
const input = {
  a: { b: [{ c: { d: "e" } }] },
  f: { g: ["h"] }
};
const index = "8"; // can be integer as well
const result = drop(input, { index: index });
console.log("result = " + JSON.stringify(result, null, 4));
// => {
//      a: {b: [{c: {d: 'e'}}]},
//      f: {g: []}
//    }
```

**[⬆ back to top](#)**

### .info()

This method lists all the nodes of a given input (AST):

```bash
-----------
    #1

key = "a"
val = {
    "b": [
        {
            "c": {
                "d": "e"
            }
        }
    ]
}
data.gatherPath = [
    1
]
-----------
    #2

key = "b"
val = [
    {
        "c": {
            "d": "e"
        }
    }
]
data.gatherPath = [
    1,
    2
]
-----------
    #3

key = {
    "c": {
        "d": "e"
    }
}
data.gatherPath = [
    1,
    2,
    3
]
-----------
    #4

key = "c"
val = {
    "d": "e"
}
data.gatherPath = [
    1,
    2,
    3,
    4
]
-----------
    #5

key = "d"
val = "e"
data.gatherPath = [
    1,
    2,
    3,
    4,
    5
]
-----------
    #6

key = "f"
val = {
    "g": [
        "h"
    ]
}
data.gatherPath = [
    6
]
-----------
    #7

key = "g"
val = [
    "h"
]
data.gatherPath = [
    6,
    7
]
-----------
    #8

key = "h"
data.gatherPath = [
    6,
    7,
    8
]
-----------
```

**[⬆ back to top](#)**

### .del()

Use method `del()` to delete all chosen key/value pairs from all objects found within an AST, or all chosen elements from all arrays.

---

**Input**

| Input argument | Type     | Obligatory? | Description                                                     |
| -------------- | -------- | ----------- | --------------------------------------------------------------- |
| `input`        | Whatever | yes         | AST tree, or object or array or whatever. Can be deeply-nested. |
| `options`      | Object   | yes         | Options object. See below.                                      |

| Options object's key | Type     | Obligatory?                              | Description                                                                                                                                                     |
| -------------------- | -------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                    |          |                                          |
| `key`                | String   | at least one, `key` or `val`             | All keys in objects or elements in arrays will be selected for deletion                                                                                         |
| `val`                | Whatever | at least one, `key` or `val`             | All object key/value pairs having this value will be selected for deletion                                                                                      |
| `only`               | String   | no (if not given, will default to `any`) | You can specify, to delete key/value pairs (if object) or elements (if array) by setting this key's value to one of the acceptable values from the table below. |
| }                    |          |                                          |

If you set only `key`, any value will be deleted as long as `key` matches. Same with specifying only `val`. If you specify both, both will have to match; otherwise, key/value pair (in objects) will not be deleted. Since arrays won't have any `val`ues, no elements in arrays will be deleted if you set both `key` and `val`.

`opts.only` values are validated via dedicated package, [util-array-object-or-both](https://gitlab.com/codsen/codsen/tree/master/packages/util-array-object-or-both). Here are the permitted values for `opts.only`, case-insensitive:

| Either type  | Interpreted as array-type | Interpreted as object-type |
| ------------ | ------------------------- | -------------------------- |
| `any`        | `array`                   | `object`                   |
| `all`        | `arrays`                  | `objects`                  |
| `everything` | `arr`                     | `obj`                      |
| `both`       | `aray`                    | `ob`                       |
| `either`     | `arr`                     | `o`                        |
| `each`       | `a`                       |
| `whatever`   |                           |
| `e`          |                           |

If `opts.only` is set to any string longer than zero characters and is not case-insensitively equal to one of the above, the `ast-monkey` will throw an error.

**Output**

| Output  | Type            | Description         |
| ------- | --------------- | ------------------- |
| `input` | Same as `input` | The amended `input` |

**Use example**

Let's say you want to delete all key/value pairs from objects that have a key equal to 'c'. Value does not matter.

```js
const {
  find,
  get,
  set,
  drop,
  info,
  del,
  arrayFirstOnly,
  traverse
} = require("ast-monkey");
const input = {
  a: { b: [{ c: { d: "e" } }] },
  c: { d: ["h"] }
};
const key = "c";
const result = del(input, { key: key });
console.log("result = " + JSON.stringify(result, null, 4));
// => {
//      a: {b: [{}]}
//    }
```

**[⬆ back to top](#)**

### .arrayFirstOnly()

(ex-`flatten()` on versions `v.<3`)

`arrayFirstOnly()` will take an input (whatever), if it's traversable, it will traverse it, leaving only the first element within each array it encounters.

```js
const {
  find,
  get,
  set,
  drop,
  info,
  del,
  arrayFirstOnly,
  traverse
} = require("ast-monkey");
const input = [
  {
    a: "a"
  },
  {
    b: "b"
  }
];
const result = arrayFirstOnly(input);
console.log("result = " + JSON.stringify(result, null, 4));
// => [
//      {
//        a: 'a'
//      }
//    ]
```

In practice, it's handy when you want to simplify the data objects. For example, all my email templates have content separated from the template layout. Content sits in `index.json` file. For dev purposes, I want to show, let's say two products in the shopping basket listing. However, in a production build, I want to have only one item, but have it sprinkled with back-end code (loop logic and so on). This means, I have to take data object meant for a dev build, and flatten all arrays in the data, so they contain only the first element. `ast-monkey` comes to help.

---

**Input**

| Input argument | Type     | Obligatory? | Description                                                     |
| -------------- | -------- | ----------- | --------------------------------------------------------------- |
| `input`        | Whatever | yes         | AST tree, or object or array or whatever. Can be deeply-nested. |

**Output**

| Output  | Type            | Description         |
| ------- | --------------- | ------------------- |
| `input` | Same as `input` | The amended `input` |

**[⬆ back to top](#)**

### .traverse()

`traverse()` comes from a standalone library, [ast-monkey-traverse](https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-traverse) and you can install and use it as a standalone. Since all methods depend on it, we are exporting it along all other methods. However, it "comes from outside", it's not part of this package's code and the true source of its API is on its own readme. Here, we're just reiterating how to use it.

`traverse()` is an inner method used by other functions. It does the actual traversal of the AST tree (or whatever input you gave, from simplest string to most complex spaghetti of nested arrays and plain objects). This ~method~ function is used via a callback function, similarly to `Array.forEach()`.

```js
const {
  find,
  get,
  set,
  drop,
  info,
  del,
  arrayFirstOnly,
  traverse
} = require("ast-monkey");
let ast = [{ a: "a", b: "b" }];
ast = traverse(ast, function(key, val, innerObj) {
  // use key, val, innerObj
  return val !== undefined ? val : key; // (point #1)
});
```

Also, I like to use it this way:

```js
const {
  find,
  get,
  set,
  drop,
  info,
  del,
  arrayFirstOnly,
  traverse
} = require("ast-monkey");
let ast = [{ a: "a", b: "b" }];
ast = traverse(ast, function(key, val, innerObj) {
  let current = val !== undefined ? val : key;
  // All action with variable `current` goes here.
  // It's the same name for any array element or any object key's value.
  return current; // it's obligatory to return it, unless you want to assign that
  // node to undefined
});
```

It's very important to **return the value on the callback function** (point marked `#1` above) because otherwise whatever you return will be written over the current AST piece being iterated.

If you definitely want to delete, return `NaN`.

**[⬆ back to top](#)**

#### innerObj in the callback

When you call `traverse()` like this:

```js
input = traverse(input, function (key, val, innerObj) {
  ...
})
```

you get three variables:

- `key`
- `val`
- `innerObj`

If monkey is currently traversing a plain object, going each key/value pair, `key` will be the object's current key and `val` will be the value.
If monkey is currently traversing an array, going through all elements, a `key` will be the current element and `val` will be `null`.

| `innerObj` object's key | Type                                                  | Description                                                                                                                                                                                                                                                                                                                                     |
| ----------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{`                     |                                                       |
| `depth`                 | Integer number                                        | Zero is root, topmost level. Every level deeper increments `depth` by `1`.                                                                                                                                                                                                                                                                      |
| `path`                  | String                                                | The path to the current value. The path uses exactly the same notation as the popular [object-path](https://www.npmjs.com/package/object-path) package. For example, `a.1.b` would be: input object's key `a` > value is array, take `1`st index (second element in a row, since indexes start from zero) > value is object, take it's key `b`. |
| `topmostKey`            | String                                                | When you are very deep, this is the topmost parent's key.                                                                                                                                                                                                                                                                                       |
| `parent`                | Type of the parent of current element being traversed | A whole parent (array or a plain object) which contains the current element. Its purpose is to allow you to query the **siblings** of the current element.                                                                                                                                                                                      |
| `}`                     |                                                       |

**[⬆ back to top](#)**

## The name of this library

HTML is parsed into nested objects and arrays which are called Abstract Syntax Trees. This library can go up and down the trees, so what's a better name than _monkey_? The **ast-monkey**. Anything-nested is can also be considered a tree – tree of plain objects, arrays and strings, for example. Monkey can [traverse](#traverse) anything really.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-monkey%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-monkey%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-monkey%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-monkey%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-monkey%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-monkey%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/ast-monkey.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ast-monkey
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-monkey
[downloads-img]: https://img.shields.io/npm/dm/ast-monkey.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-monkey
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-monkey
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
