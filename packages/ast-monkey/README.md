# ast-monkey

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Utility library for ops on parsed HTML (AST's) or anything nested (plain objects within arrays within plain objects)

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

* If you only need traversal function, install on it: [ast-monkey-traverse](https://github.com/codsen/ast-monkey-traverse)

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Idea](#idea)
- [API](#api)
  - [.find()](#find)
  - [.get()](#get)
  - [.set()](#set)
  - [.drop()](#drop)
  - [.info()](#info)
  - [.del()](#del)
  - [.arrayFirstOnly()](#arrayfirstonly)
  - [.traverse()](#traverse)
    - [innerObj in the callback](#innerobj-in-the-callback)
- [The name of this library](#the-name-of-this-library)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
npm i ast-monkey
```

Then, consume either in CommonJS format (`require`) or as an ES Module (`import`):

```js
// as CommonJS require:
const monkey = require('ast-monkey')
// or as ES Module:
import { find, get, set, drop, info, del, arrayFirstOnly, traverse } from 'ast-monkey'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/ast-monkey.cjs.js` | 9&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/ast-monkey.esm.js` | 8&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/ast-monkey.umd.js` | 40&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Idea

The main purpose of this library is to do operations on parsed HTML, but more and more I'm [using](#traverse) it everywhere else where I have nested arrays and/or plain objects.

Working with parsed HTML (AST trees) is hard when you want to go "up" the branches because "AST-walking" algorithms usually just go through all the nodes, from the first one to the last one.

`ast-monkey`'s primary purpose is to help in those cases when you want to go _up the branches_ — to be able to query what is the current node's parent (and optionally all the way up).

`ast-monkey`'s secondary purpose is to give us a reliable, tested [traversal function](#traverse), so you don't have to write yours each time. I took the idea from PostHTML traversal but rewrote it adding more powerful features (such as reporting the current depth in the AST).

`ast-monkey` algorithm assigns indexes to every traversed node so that you can visit it again. Also, [.find()](#find) will record the "bread crumb"-style indexes path to each found node. This, combined with [.get()](#get) function allows you to traverse the tree "up", from the found child node up all the way until its topmost parent node is reached.

Using this library, you can delete the particular piece of AST (method [.drop()](#drop)) or overwrite (method [.set()](#set)). You can also perform searches by object's/array's `key`, `value` or both (method [.find()](#find)). You can retrieve all contents of any piece of AST by index (method [.get()](#get)) or list all indexes (method [.info()](#info)).

Alternatively, you can tap into the core of the monkey, the [.traverse()](#traverse) function and save yourself the trouble writing recursive walk-through functions - the [.traverse()](#traverse) will walk through every single element of an array or key of an object, giving you the current thing via the familiar callback function interface (just like `Array.forEach` or `Array.map`).

**[⬆ &nbsp;back to top](#)**

## API

### .find()

Method `monkey.find()` can search objects by key or by value or by both and return the indexes path to an each finding.

---

**Input**

Input argument   | Type             | Obligatory? | Description
-----------------|------------------|-------------|--------------
`input`          | Whatever         | yes         | AST tree, or object or array or whatever. Can be deeply-nested.
`options`        | Object           | yes         | Options object. See below.

Options object's key  | Type             | Obligatory?                  | Description
----------------------|------------------|------------------------------|-------------
{                     |                  |                              |
`key`                 | String           | at least one, `key` or `val` | If you want to search by a plain object's key, put it here.
`val`                 | Whatever         | at least one, `key` or `val` | If you want to search by a plain object's value, put it here.
`only`                | String           | no (if not given, will default to `any`) | You can specify, to find only within arrays, objects or any. `any` is default and will be set if `opts.only` is not given.
}                     |                  |                              |

Either `opts.key` or `opts.val` or both must be present. If both are missing, `ast-monkey` will throw an error.

`opts.only` is validated via dedicated package, [util-array-object-or-both](https://github.com/codsen/util-array-object-or-both). Here are the permitted values for `opts.only`, case-insensitive:

Either type  | Interpreted as array-type | Interpreted as object-type
-------------|---------------------------|----------------------------
`any`        |  `array`                  | `object`
`all`        |  `arrays`                 | `objects`
`everything` |  `arr`                    | `obj`
`both`       |  `aray`                   | `ob`
`either`     |  `arr`                    | `o`
`each`       |  `a`                      |
`whatever`   |                           |
`e`          |                           |

If `opts.only` is set to any string longer than zero characters and is not case-insensitively equal to one of the above, the `ast-monkey` will throw an error.

**Output**

The output will be an array, comprising of zero or more plain objects in the following format:

Object's key     | Type             | Description
-----------------|------------------|-------------
{                |                  |
`index`          | Integer number   | The index of the finding. It's also the last element of the `path` array.
`key`            | String           | The found object's key
`val`            | Whatever or Null | The found object's value (or `null` if it's a key of an array)
`path`           | Array            | The found object's path: indexes of all its parents, starting from the topmost. The found key/value pair's address will be the last element of the `path` array.
}                |                  |

If a finding is an element of an array, the `val` will be set to `null`.

**Use example**

Find out, what is the path to the key that equals 'b'.

```js
const monkey = require('ast-monkey')
var input = ['a', [['b'], 'c']]
var key = 'b'
var result = monkey.find(input, {key: key})
console.log('result = ' + JSON.stringify(result, null, 4))
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

**[⬆ &nbsp;back to top](#)**

### .get()

Use method `monkey.get()` to query AST trees by branch's index (a numeric id). You would get that index from a previously performed `monkey.find()` or you can pick a number manually, possibly choosing one of the indexes from `monkey.info()` output.

Practically, `monkey.get()` is typically used on each element of the findings array (which you would get after performing `find()`). Then, depending on your needs, you would write the particular index over using `monkey.set()` or delete it using `monkey.drop()`.

---

**Input**

Input argument   | Type                      | Obligatory? | Description
-----------------|---------------------------|-------------|-------------
`input`          | Whatever                  | yes         | AST tree, or object or array or whatever. Can be deeply-nested.
`options`        | Object                    | yes         | Options object. See below.

Options object   | Type                      | Obligatory? | Description
-----------------|---------------------------|-------------|-------------
{                |                           |             |
`index`          | Number or number-as-string | yes        | Index number of piece of AST you want the monkey to retrieve for you.
}                |                           |             |

**Output**

The `monkey.get()` returns object, array or `null`, depending what index was matched (or not).

**Use example**

If you know that you want an index number two, you can query it using `monkey.get()`:

```js
const monkey = require('ast-monkey')
var input = {
  a: {
    b: 'c'
  }
}
var index = 2
var result = monkey.get(input, {index: index})
console.log('result = ' + JSON.stringify(result, null, 4))
// => {
//      b: 'c'
//    }
```

In practice, you would query a list of indexes programmatically using a `for` loop.

**[⬆ &nbsp;back to top](#)**

### .set()

Use method `monkey.set()` to overwrite a piece of an AST when you know its index.

---

**Input**

Input argument   | Type            | Obligatory? | Description
-----------------|-----------------|-------------|-------------
`input`          | Whatever        | yes         | AST tree, or object or array or whatever. Can be deeply-nested.
`options`        | Object          | yes         | Options object. See below.

Options object   | Type                       | Obligatory? | Description
-----------------|----------------------------|-------------|-------------
{                |                            |             |
`index`          | Number or number-as-string | yes         | Index of the piece of AST to find and replace
`val`            | Whatever                   | yes         | Value to replace the found piece of AST with
}                |                            |             |

**Output**

Output           | Type             | Description
-----------------|------------------|--------------------
`input`          | Same as input    | The amended `input`

**Use example**

Let's say you identified the `index` of a piece of AST you want to write over:

```js
const monkey = require('ast-monkey')
var input = {
  a: {b: [{c: {d: 'e'}}]},
  f: {g: ['h']}
}
var index = '7'
var val = 'zzz'
var result = monkey.set(input, {index: index, val: val})
console.log('result = ' + JSON.stringify(result, null, 4))
// => {
//      a: {b: [{c: {d: 'e'}}]},
//      f: {g: 'zzz'}
//    }
```

**[⬆ &nbsp;back to top](#)**

### .drop()

Use method `monkey.drop()` to delete a piece of an AST with a known index.

---

**Input**

Input argument   | Type                      | Obligatory? | Description
-----------------|---------------------------|-------------|-------------
`input`          | Whatever                  | yes         | AST tree, or object or array or whatever. Can be deeply-nested.
`options`        | Object                    | yes         | Options object. See below.

Options object's key | Type                       | Obligatory? | Description
---------------------|----------------------------|-------------|-------------
{                    |                            |             |
`index`              | Number or number-as-string | yes         | Index number of piece of AST you want the monkey to delete for you.
}                    |                            |             |

**Output**

Output           | Type             | Description
-----------------|------------------|--------------------
`input`          | Same as `input`  | The amended `input`

**Use example**

Let's say you want to delete the piece of AST with an index number 8. That's `'h'`:

```js
const monkey = require('ast-monkey')
var input = {
  a: {b: [{c: {d: 'e'}}]},
  f: {g: ['h']}
}
var index = '8' // can be integer as well
var result = monkey.drop(input, {index: index})
console.log('result = ' + JSON.stringify(result, null, 4))
// => {
//      a: {b: [{c: {d: 'e'}}]},
//      f: {g: []}
//    }
```

**[⬆ &nbsp;back to top](#)**

### .info()

Use method `monkey.info()` to list each index and its contents on the command line. It's mainly for testing purposes.

Let's create a file `testing.js` in the root of this library, at the same level where `index.js` is:

```js
'use strict'
const monkey = require('./index');
(function () {
  var input = {
    a: {b: [{c: {d: 'e'}}]},
    f: {g: ['h']}
  }
  monkey.info(input)
})()
```

That's basically an [IIFE](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch3.md) to consume `monkey.info()` function sitting at the same level (signed by `./`).

Then, in the command line, navigate to the same root folder where `testing.js` and `index.js` is and call it via node:

```bash
node testing
```

You'll get the listing of each index of the input:

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

**[⬆ &nbsp;back to top](#)**

### .del()

Use method `monkey.del()` to delete all chosen key/value pairs from all objects found within an AST, or all chosen elements from all arrays.

---

**Input**

Input argument   | Type                      | Obligatory? | Description
-----------------|---------------------------|-------------|-------------
`input`          | Whatever                  | yes         | AST tree, or object or array or whatever. Can be deeply-nested.
`options`        | Object                    | yes         | Options object. See below.

Options object's key  | Type             | Obligatory?                  | Description
----------------------|------------------|------------------------------|-------------
{                     |                  |                              |
`key`                 | String           | at least one, `key` or `val` | All keys in objects or elements in arrays will be selected for deletion
`val`                 | Whatever         | at least one, `key` or `val` | All object key/value pairs having this value will be selected for deletion
`only`                | String           | no (if not given, will default to `any`) | You can specify, to delete key/value pairs (if object) or elements (if array) by setting this key's value to one of the acceptable values from the table below.
}                     |                  |                              |

If you set only `key`, any value will be deleted as long as `key` matches. Same with specifying only `val`. If you specify both, both will have to match; otherwise, key/value pair (in objects) will not be deleted. Since arrays won't have any `val`ues, no elements in arrays will be deleted if you set both `key` and `val`.

`opts.only` values are validated via dedicated package, [util-array-object-or-both](https://github.com/codsen/util-array-object-or-both). Here are the permitted values for `opts.only`, case-insensitive:

Either type  | Interpreted as array-type | Interpreted as object-type
-------------|---------------------------|----------------------------
`any`        |  `array`                  | `object`
`all`        |  `arrays`                 | `objects`
`everything` |  `arr`                    | `obj`
`both`       |  `aray`                   | `ob`
`either`     |  `arr`                    | `o`
`each`       |  `a`                      |
`whatever`   |                           |
`e`          |                           |

If `opts.only` is set to any string longer than zero characters and is not case-insensitively equal to one of the above, the `ast-monkey` will throw an error.

**Output**

Output           | Type             | Description
-----------------|------------------|--------------------
`input`          | Same as `input`  | The amended `input`

**Use example**

Let's say you want to delete all key/value pairs from objects that have a key equal to 'c'. Value does not matter.

```js
const monkey = require('ast-monkey')
var input = {
  a: {b: [{c: {d: 'e'}}]},
  c: {d: ['h']}
}
var key = 'c'
var result = monkey.del(input, {key: key})
console.log('result = ' + JSON.stringify(result, null, 4))
// => {
//      a: {b: [{}]}
//    }
```

**[⬆ &nbsp;back to top](#)**

### .arrayFirstOnly()

(ex-`flatten()` on versions `v.<3`)

`monkey.arrayFirstOnly()` will take an input (whatever), if it's traversable, it will traverse it, leaving only the first element within each array it encounters.

```js
const monkey = require('ast-monkey')
var input = [
  {
    a: 'a'
  },
  {
    b: 'b'
  }
]
var result = monkey.arrayFirstOnly(input)
console.log('result = ' + JSON.stringify(result, null, 4))
// => [
//      {
//        a: 'a'
//      }
//    ]
```

In practice, it's handy when you want to simplify the data objects. For example, all my email templates have content separated from the template layout. Content sits in `index.json` file. For dev purposes, I want to show, let's say two products in the shopping basket listing. However, in a production build, I want to have only one item, but have it sprinkled with back-end code (loop logic and so on). This means, I have to take data object meant for a dev build, and flatten all arrays in the data, so they contain only the first element. `ast-monkey` comes to help.

---

**Input**

Input argument   | Type                      | Obligatory? | Description
-----------------|---------------------------|-------------|-------------
`input`          | Whatever                  | yes         | AST tree, or object or array or whatever. Can be deeply-nested.

**Output**

Output           | Type             | Description
-----------------|------------------|--------------------
`input`          | Same as `input`  | The amended `input`

**[⬆ &nbsp;back to top](#)**

### .traverse()

`traverse()` comes from a standalone library, [ast-monkey-traverse](https://github.com/codsen/ast-monkey-traverse) and you can install and use it as a standalone. Since all methods depend on it, we are exporting it along all other methods. However, it "comes from outside", it's not part of this package's code and the true source of its API is on its own readme. Here, we're just reiterating how to use it.

`traverse()` is an inner method used by other functions. It does the actual traversal of the AST tree (or whatever input you gave, from simplest string to most complex spaghetti of nested arrays and plain objects). This ~method~ function is used via a callback function, similarly to `Array.forEach()`.

```js
const monkey = require('ast-monkey')
var ast = [{a: 'a', b: 'b'}]
ast = monkey.traverse(ast, function (key, val, innerObj) {
  // use key, val, innerObj
  return (val !== undefined) ? val : key // (point #1)
})
```

Also, I like to use it this way:

```js
const monkey = require('ast-monkey')
var ast = [{a: 'a', b: 'b'}]
ast = monkey.traverse(ast, function (key, val, innerObj) {
  var current = (val !== undefined) ? val : key
  // All action with variable `current` goes here.
  // It's the same name for any array element or any object key's value.
  return current // it's obligatory to return it, unless you want to assign that
  // node to undefined
})
```

It's very important to **return the value on the callback function** (point marked `#1` above) because otherwise whatever you return will be written over the current AST piece being iterated.

If you definitely want to delete, return `NaN`.

**[⬆ &nbsp;back to top](#)**

#### innerObj in the callback

When you call `traverse()` like this:

```js
input = monkey.traverse(input, function (key, val, innerObj) {
  ...
})
```

you get three variables:

- `key`
- `val`
- `innerObj`

If monkey is currently traversing a plain object, going each key/value pair, `key` will be the object's current key and `val` will be the value.
If monkey is currently traversing an array, going through all elements, a `key` will be the current element and `val` will be `null`.

`innerObj` object's key | Type           | Description
------------------------|----------------|----------------------
`{`                     |                |
`depth`                 | Integer number | Zero is root, topmost level. Every level deeper increments `depth` by `1`.
`topmostKey`            | String         | When you are very deep, this is the topmost parent's key.
`parent`                | Type of the parent of current element being traversed | A whole parent (array or a plain object) which contains the current element. It's purpose is to allow you to query the **siblings** of the current element.
`}`                     |                |

Allow me to show you how to practically tap the `innerObj`:

```js
const monkey = require('ast-monkey')
var ast = {
            a: {
              b: 'b val'
            },
            c: 'c val'
          }
ast = monkey.traverse(ast, function (key, val, innerObj) {
  var current = monkey.existy(val) ? val : key
  console.log('\nkey = ' + JSON.stringify(key, null, 4))
  console.log('val = ' + JSON.stringify(val, null, 4))
  console.log('innerObj = ' + JSON.stringify(innerObj, null, 4))
  return current
})
// ...
```

CONSOLE OUTPUT WILL BE:

```js
key = "a"
val = {
    "b": "b val"
}
innerObj = {
    "depth": 0,
    "topmostKey": "a",
    "parent": {
        "a": {
            "b": "b val"
        },
        "c": "c val"
    }
}

key = "b"
val = "b val"
innerObj = {
    "depth": 1,
    "topmostKey": "a",
    "parent": {
        "b": "b val"
    }
}

key = "c"
val = "c val"
innerObj = {
    "depth": 0,
    "topmostKey": "c",
    "parent": {
        "a": {
            "b": "b val"
        },
        "c": "c val"
    }
}
```

**[⬆ &nbsp;back to top](#)**

## The name of this library

HTML is parsed into nested objects and arrays which are called Abstract Syntax Trees. This library can go up and down the trees, so what's a better name than _monkey_? The **ast-monkey**. Anything-nested is can also be considered a tree – tree of plain objects, arrays and strings, for example. Monkey can [traverse](#traverse) anything really.

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/ast-monkey/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/ast-monkey/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/ast-monkey/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/ast-monkey.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ast-monkey

[npm-img]: https://img.shields.io/npm/v/ast-monkey.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/ast-monkey

[travis-img]: https://img.shields.io/travis/codsen/ast-monkey.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/ast-monkey

[cov-img]: https://coveralls.io/repos/github/codsen/ast-monkey/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/ast-monkey?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/ast-monkey.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/ast-monkey

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/ast-monkey.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/ast-monkey/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-monkey

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/ast-monkey.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/ast-monkey/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/ast-monkey/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/ast-monkey

[downloads-img]: https://img.shields.io/npm/dm/ast-monkey.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-monkey

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-monkey

[license-img]: https://img.shields.io/npm/l/ast-monkey.svg?style=flat-square
[license-url]: https://github.com/codsen/ast-monkey/blob/master/license.md
