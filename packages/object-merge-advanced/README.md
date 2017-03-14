# object-merge-advanced

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Recursive, deep merge of anything (objects, arrays, strings or nested thereof), which weighs contents by type hierarchy to ensure the maximum content is retained

[![Build Status][travis-img]][travis-url]
[![Coverage Status][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Downloads/Month][downloads-img]][downloads-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Purpose](#purpose)
- [In practice](#in-practice)
- [Use](#use)
- [API](#api)
  - [API - Input](#api---input)
  - [API - Output](#api---output)
- [Testing](#testing)
- [Contributing](#contributing)
- [Difference from `object-assign`](#difference-from-object-assign)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
$ npm install --save object-merge-advanced
```

## Purpose

It's like `_.merge`, but it correctly merges different-type things and behaves well when it encounters _nested things_ like parsed HTML (lots of nested arrays, objects and strings).

I was not happy with Lodash [_.merge](https://lodash.com/docs/#merge) because it gets stuck when it encounters mismatching type values within plain objects. All I wanted is to merge two plain objects, retaining as much information as possible after the merging.

I was not happy with [object-assign](https://github.com/sindresorhus/object-assign) which doesn't care about what type is overwriting what type — it can merge value as String containing some text with Boolean `false`, for example. `object-assign` is good to merge default key set, but not to merge to objects containing precious content.

Merge these two:

```
// #1:
{
  a: {
    b: 'c',
    d: ['e', 'f']
  }
}

// and #2:
{
  a: [
    {
      x: 'y'
    }
  ]
}
```

---

Imagine, if we merged the identical keys of two objects judging their values by the hierarchy instead:

- non-empty array trumps all below
- non-empty plain object trumps all below
- non-empty string ...
- empty plain object ...
- empty array
- empty string
- number
- boolean
- null
- undefined doesn't trump anything

The idea is, we strive to retain as much info as possible after merging. For example, you'd be better off with a non-empty string that with an empty array or boolean.

**That's what this library does**

When `object-merge-advanced` merges two _objects_, it will check the types of their key values:

* If a key exists only in one of the objects, it goes straight into the result object.
* If a key exists on both, we got a clash. Key's value will be chosen judging by its value's type:
  * Arrays trump objects which trump strings which trump numbers which trump Booleans
  * Non-empty array as value trumps any object or string as value
  * Anything empty won't trump anything not empty
  * If both keys have plain object values, they'll get recursively fed back into the library again
  * Booleans will be merged using logical "OR"
  * Arrays will be merged, and if there are objects within, those objects will be merged smartly, depending if their keysets are similar. If not, objects will be merged as separate array elements.

There are ten possible combinations: 10 types of first input (object #1) and ten types of second input (object #2): non-empty (full) object, empty object, non-empty array, empty array, non-empty string, empty string, number, boolean, undefined and null.

![matching algorithm](http://i.imgsafe.org/7e71b2b3b0.png)

A Large number in the centre of a square shows which value prevails.

In the diagram above, the squares show **which value wins**, first object's (marked `01`) or second one's (marked `02`). In other words, do we assign second object's value onto first, or the opposite.

In certain cases, there are custom actions needed:

1) passing value objects back into the main function _recursively_ (when both values are plain objects),
2) array merge paying extra attention to options object and array contents (special measures for objects within), or
3) Boolean "and" composition (when both values are Boolean).

I challenge you to check `test.js` unit tests to see this library in action.

## In practice

In practice I needed this library to normalise JSON files — generate a "schema" object (a superset of all used keys) and fill any missing keys within all JSON files. Also, JSON files get their keys sorted. That library is used to keep us sane when using JSON to store content for email templates — it's enough to add one unique key in one JSON, and all other templates' content files get it added as well.

## Use

```js
var mergeAdvanced = require('object-merge-advanced')
```

## API

```js
mergeAdvanced(object1, object2)
```

### API - Input

Input argument           | Type           | Obligatory? | Description
-------------------------|----------------|-------------|-------------
`object1`                | Plain object   | yes         | Plain object. Can have nested values.
`object2`                | Plain object   | yes         | Another plain object. Can have nested values.
`options`                | Plain object   | no          | Pass all settings as a plain object, as a third argument

Options object's key                | Value   | Default | Description
------------------------------------|---------|---------|-------------
`{`                                 |         |         |
`mergeObjectsOnlyWhenKeysetMatches` | Boolean | true    | Controls the merging of the objects within arrays. See below.
`}`                                 |         |         |

`mergeObjectsOnlyWhenKeysetMatches` is an extra insurance from accidental merging two objects within arrays, where key sets are too different (both have at least one unique key).

For example:

Let's merge these two objects. Notice that each has a unique key (`yyyy` and `xxxx` in the object that sits within the first position of each array).

```js
// #1
var obj1 = {
  a: [
    {
      a: 'a',
      b: 'b',
      yyyy: 'yyyy'
    }
  ]
}

var obj2 = {
  a: [
    {
      xxxx: 'xxxx',
      b: 'b',
      c: 'c'
    }
  ]
}

var res1 = mergeAdvanced(object1, object2)

console.log('res1 = ' + JSON.stringify(res1, null, 4))
// => {
//      a: [
//        {
//          a: 'a',
//          b: 'b',
//          yyyy: 'yyyy'
//        },
//        {
//          xxxx: 'xxxx',
//          b: 'b',
//          c: 'c'
//        }
//      ]
//    }

```

but if you turn off the safeguard, `{ mergeObjectsOnlyWhenKeysetMatches: false }` each object within an array is merged no matter their differences in the keysets:

```js
var res2 = mergeAdvanced(object1, object2, { mergeObjectsOnlyWhenKeysetMatches: false })
console.log('res2 = ' + JSON.stringify(res2, null, 4))
// => {
//      a: [
//        {
//          a: 'a',
//          b: 'b',
//          yyyy: 'yyyy',
//          xxxx: 'xxxx',
//          c: 'c'
//        }
//      ]
//    }
```

### API - Output

A new plain object is returned. Input objects are **not mutated** (v2.x onwards).

## Testing

```bash
$ npm test
```

For unit tests we use [AVA](https://github.com/avajs/ava), [Istanbul CLI](https://github.com/istanbuljs/nyc) and [JS Standard](https://github.com/feross/standard) notation.

I aim to have 100% code coverage, which it is at the moment.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://github.com/feross/standard) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/code-and-send/object-merge-advanced/issues). If you file a pull request, I'll do my best to help you to get it merged promptly. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email.

## Difference from `object-assign`

`object-assign` doesn't compare _types_ of what's merged.

[object-assign](https://github.com/sindresorhus/object-assign) will simply take first argument object, overwrite the second one onto it. Then it will take the result and overwrite third argument object onto it. And so on. Every subsequent object's key will overwrite an existing one.

It's best to use `object-assign` when you care little about a base object (first input argument), for example when it's a default values' object. In such cases, when the base object (first argument of `object-assign`) is overwritten, that's OK.

However, when all incoming (second arg onwards) objects can contain placeholder values in a Boolean format, `object-assign` doesn't work, because any Boolean placeholder key values will overwrite base object's real values in String.

When you want to merge objects seeking maximum data retention, the 'object-merge-advanced' is the best.

---

For example, in my email template builds, I import SCSS variables file as an object. I also import variables for each template, and template variables object overwrites anything existing in SCSS variables object.

That's because I want to be able to overwrite global colours per-template when needed.

Now imagine, we're merging those two objects, and SCSS variables object has a key `"mainbgcolor": "#ffffff"`. Now, a vast majority of templates don't need any customisation for the main background, therefore in their content JSON files the key is set to default, Boolean `false`: `"mainbgcolor": false`.

If merging were done using `object-assign`, placeholder `false` would overwrite real string value `"#ffffff`. That means, HTML would receive "false" as a CSS value, which is harsh pink!

If merging were done using this library, `object-merge-advanced`, all would be fine, because String trumps Boolean — placeholder `false`s would not overwrite default SCSS string values.

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

[travis-img]: https://travis-ci.org/code-and-send/object-merge-advanced.svg?branch=master
[travis-url]: https://travis-ci.org/code-and-send/object-merge-advanced

[cov-img]: https://coveralls.io/repos/github/code-and-send/object-merge-advanced/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/code-and-send/object-merge-advanced?branch=master

[overall-img]: https://www.bithound.io/github/code-and-send/object-merge-advanced/badges/score.svg
[overall-url]: https://www.bithound.io/github/code-and-send/object-merge-advanced

[deps-img]: https://www.bithound.io/github/code-and-send/object-merge-advanced/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/code-and-send/object-merge-advanced/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/code-and-send/object-merge-advanced/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/code-and-send/object-merge-advanced/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/object-merge-advanced.svg
[downloads-url]: https://www.npmjs.com/package/object-merge-advanced
