# ast-monkey

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Utility library for operations on parsed HTML (AST's)

[![Build Status][travis-img]][travis-url]
[![Coverage Status][cov-img]][cov-url]
[![bitHound Score][bithound-img]][bithound-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Downloads/Month][downloads-img]][downloads-url]

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
- [Unit testing and code coverage](#unit-testing-and-code-coverage)
- [Contributing](#contributing)
- [The name of this library](#the-name-of-this-library)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm install --save ast-monkey
```

## Idea

The main purpose of this library is to do operations on parsed HTML, but more and more I'm [using](#traverse) it everywhere else where I have nested arrays and/or plain objects.

Working with parsed HTML (AST trees) is hard when you want to go "up" the branches because "AST-walking" algorithms usually just go through all the nodes, from the first one to the last one.

`ast-monkey`'s primary purpose is to help in those cases when you want to go _up the branches_ — to be able to query what is the current node's parent (and optionally all the way up).

`ast-monkey`'s secondary purpose is to give us a reliable, tested [traversal function](#traverse), so you don't have to write yours each time. I took the idea from PostHTML traversal but rewrote it adding more powerful features (such as reporting the current depth in the AST).

`ast-monkey` algorithm assigns indexes to every traversed node so that you can visit it again. Also, [.find()](#find) will record the "bread crumb"-style indexes path to each found node. This, combined with [.get()](#get) function allows you to traverse the tree "up", from the found child node up all the way until its topmost parent node is reached.

Using this library, you can delete the particular piece of AST (method [.drop()](#drop)) or overwrite (method [.set()](#set)). You can also perform searches by object's/array's `key`, `value` or both (method [.find()](#find)). You can retrieve all contents of any piece of AST by index (method [.get()](#get)) or list all indexes (method [.info()](#info)).

Alternatively, you can tap into the core of the monkey, the [.traverse()](#traverse) function and save yourself the trouble writing recursive walk-through functions — the [.traverse()](#traverse) will walk through every single element of an array or key of an object, giving you the current thing via the familiar callback function interface (just like `Array.forEach` or `Array.map`).

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
}                     |                  |                              |

Either `opts.key` or `opts.val` or both must be present. If both are missing, `ast-monkey` will throw an error.

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

### .set()

Use method `monkey.set()` to overwrite a piece of an AST with a known index.

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
}                     |                  |                              |

If you set only `key`, any value will be deleted as long as `key` matches. Same with specifying only `val`. If you specify both, both will have to match; otherwise, key/value pair (in objects) will not be deleted. Since arrays won't have any `val`ues, no elements in arrays will be deleted if you set both `key` and `val`.

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

### .traverse()

This one is a bit advanced and riskier in wrong hands.

`traverse()` is an inner method used by other functions. It does the actual traversal of the AST tree (or whatever input you gave, from simplest string to most complex spaghetti of nested arrays and plain objects). This ~method~ function is used via a callback function, similarly to `Array.forEach()`.

```js
const monkey = require('ast-monkey')
var ast = [{a: 'a', b: 'b'}]
ast = monkey.traverse(ast, function (key, val, innerObj) {
  // use key, val, innerObj
  return monkey.existy(val) ? val : key // (point #1)
})
```

Also, I like to use it this way:

```js
const monkey = require('ast-monkey')
var ast = [{a: 'a', b: 'b'}]
ast = monkey.traverse(ast, function (key, val, innerObj) {
  var current = monkey.existy(val) ? val : key
  // All action with variable `current` goes here.
  // It's the same name for any array element or any object key's value.
  return current // it's obligatory to return it, unless you want to delete that node
})
```

It's very important to **return the value on the callback function** (point marked `#1` above) because otherwise whatever you return will be written over the current AST piece being iterated.

If you definitely want to delete, return `NaN`.

By the way, the one-liner `existy()` is taken from Michael Fogus book "Functional JavaScript". It's the greatest snippet of all times (ok, `console.log('var = ' + JSON.stringify(var, null, 4))` is also a contender for the top spot).

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

If monkey is currently traversing a plain object, going each key/value pair, `key` will be key and `val` will be the value.
If monkey is currently traversing an array, going each element, `key` will be the current element. `val` will be `null`.

`innerObj` object's key | Type           | Description
------------------------|----------------|----------------------
`{`                     |                |
`depth`                 | Integer number | Zero is root, topmost level. Every level deeper increments `depth` by `1`.
`topmostKey`            | String         | When you are very deep, this is the topmost parent's key.
`parent`                | Type of the parent of current element being traversed | A whole parent (array or a plain object) which contains the current element. It's purpose is to allow you to query the **siblings** of the current element.
`}`                     |                |

Allow me to show you how to tap the `innerObj` practically;

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

## Unit testing and code coverage

```bash
$ npm test
```

Unit tests use [AVA](https://github.com/avajs/ava) and [JS Standard](https://standardjs.com) notation. Unit test code coverage is calculated using [Istanbul](https://www.npmjs.com/package/nyc).

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/ast-monkey/issues). If you file a pull request, I'll do my best to help you to get it merged as soon as possible. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

## The name of this library

HTML is parsed into nested objects and arrays which are called Abstract Syntax Trees. This library can go up and down the trees, so what's a better name than _monkey_? The **ast-monkey**.

## Licence

> MIT License (MIT)

> Copyright (c) 2017 Codsen Ltd, Roy Reveltas

> Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[travis-img]: https://travis-ci.org/codsen/ast-monkey.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/ast-monkey

[cov-img]: https://coveralls.io/repos/github/codsen/ast-monkey/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/ast-monkey?branch=master

[bithound-img]: https://www.bithound.io/github/codsen/ast-monkey/badges/score.svg
[bithound-url]: https://www.bithound.io/github/codsen/ast-monkey

[deps-img]: https://www.bithound.io/github/codsen/ast-monkey/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/ast-monkey/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/ast-monkey/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/ast-monkey/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/ast-monkey.svg
[downloads-url]: https://www.npmjs.com/package/ast-monkey
