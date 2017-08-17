# object-merge-advanced

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Recursive, deep merge of anything (objects, arrays, strings or nested thereof), which weighs contents by type hierarchy to ensure the maximum content is retained

[![Build Status][travis-img]][travis-url]
[![Coverage Status][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
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
- [Difference from Lodash `_.merge`](#difference-from-lodash-_merge)
- [Difference from `object-assign`](#difference-from-object-assign)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
$ npm install --save object-merge-advanced
```

## Purpose

It's like `_.merge`, but it correctly merges different-type things and behaves well when it encounters _nested things_ like parsed HTML (lots of nested arrays, objects and strings).

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

The idea is, we strive to retain as much info as possible after merging. For example, you'd be better off with a non-empty string than with an empty array or boolean.

The fun does not stop here. Sometimes life demands _unidirectional merges_ from either source or destination ("overwrite no matter what, from either side"). This can be done per object-key-basis, see `opts.ignoreKeys` where first input object's key overrides the second's and `opts.hardMergeKeys` for the opposite.

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

In the diagram above, the squares show **which value gets assigned to the merge result** — the first object's (marked `1`, pink fields) or second one's (marked `2`, sky blue fields).

In some cases, we perform a custom actions:

1) passing value objects back into the main function _recursively_ (when both values are plain objects),
2) when merging arrays, we pay extra attention to the options object (if present) and the contents of both arrays (taking special measures for objects within),
3) Logical "OR" composition (when both values are Boolean).

I challenge you to check `test.js` unit tests to see this library in action.

## In practice

In practice I needed this library to normalise JSON files - [generate](https://github.com/codsen/json-comb-core#getkeyset) a "schema" object (a superset of all used keys) and fill any missing keys within all JSON files. Also, JSON files get their keys sorted. That library is used to keep us sane when using JSON to store content for email templates - it's enough to add one unique key in one JSON, and all other templates' content files get it added as well.

I use unidirectional merging when dealing with content mapping JSON files which are by definition unidirectional-flow (always overwrite normal data JSON files).

## Use

```js
var mergeAdvanced = require('object-merge-advanced')
```

## API

```js
mergeAdvanced(input1, input2 [, { options }])
```

### API - Input

Input argument           | Type           | Obligatory? | Description
-------------------------|----------------|-------------|-------------
`input1`                 | Anything       | yes         | Normally an object literal, but array or string or whatever else will work too. Can be deeply nested.
`input2`                 | Anything       | yes         | Another thing, normally an object, but can be array or something else.
`options`                | Plain object   | no          | Optionally, pass all settings in a plain object, as a third argument

Options object's key                    | Value   | Default | Description
----------------------------------------|---------|---------|-------------
`{`                                     |         |         |
`mergeObjectsOnlyWhenKeysetMatches`     | Boolean | `true`  | Controls the merging of the objects within arrays. See below.
`ignoreKeys`                            | String  | n/a     | These keys, if present on `input1`, will be kept and not merged, that is, changed. You can use wildcards.
`hardMergeKeys`                         | String  | n/a     | These keys, if present on `input2`, will overwrite their counterparts on `input1` (if present) no matter what. You can use wildcards.
`mergeArraysContainingStringsToBeEmpty` | Boolean | `false` | If any arrays contain strings, resulting merged array will be empty IF this setting is set to `true`.
`oneToManyArrayObjectMerge`             | Boolean | `false` | If one array has one object, but another array has many objects, when `oneToManyArrayObjectMerge` is `true`, each object from "many-objects" array will be merged with that one object from "one-object" array. Handy when setting defaults on JSON data structures.
`}`                                     |         |         |

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

A merged thing is returned. It's probably the same type of your inputs.

Objects or arrays in the inputs are **not mutated**. This is very important.

## Testing

```bash
$ npm test
```

For unit tests we use [AVA](https://github.com/avajs/ava), [Istanbul CLI](https://github.com/istanbuljs/nyc) and [JS Standard](https://standardjs.com) notation.

I aim to have 100% code coverage (which is the case at the moment).

## Difference from Lodash `_.merge`

Lodash [_.merge](https://lodash.com/docs/#merge) gets stuck when encounters a mismatching type values within plain objects. It's not suitable for merging AST's, nor deep recursive merging.

## Difference from `object-assign`

[object-assign](https://github.com/sindresorhus/object-assign) is just a hard overwrite of all existing keys, from one object to another. It does not weigh the types of the input values and will happily overwrite the string value with a boolean placeholder.

`object-assign` is not for merging data objects, it's for _setting defaults_ in the options objects.

For example, in my email template builds, I import SCSS variables file as an object. I also import variables for each template, and template variables object overwrites anything existing in SCSS variables object.

That's because I want to be able to overwrite global colours per-template when needed.

Now imagine, we're merging those two objects, and SCSS variables object has a key `"mainbgcolor": "#ffffff"`. Now, a vast majority of templates don't need any customisation for the main background, therefore in their content JSON files the key is set to default, Boolean `false`: `"mainbgcolor": false`.

If merging were done using `object-assign`, placeholder `false` would overwrite real string value `"#ffffff`. That means, HTML would receive "false" as a CSS value, which is pink!

If merging were done using `object-merge-advanced`, all would be fine, because String trumps Boolean — placeholder `false`s would not overwrite the default SCSS string values.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/object-merge-advanced/issues). If you file a pull request, I'll do my best to help you to get it merged promptly. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email.

## Licence

> MIT License (MIT)

> Copyright (c) 2017 Codsen Ltd, Roy Revelt

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

[travis-img]: https://travis-ci.org/codsen/object-merge-advanced.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/object-merge-advanced

[cov-img]: https://coveralls.io/repos/github/codsen/object-merge-advanced/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/object-merge-advanced?branch=master

[overall-img]: https://www.bithound.io/github/codsen/object-merge-advanced/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/object-merge-advanced

[deps-img]: https://www.bithound.io/github/codsen/object-merge-advanced/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/object-merge-advanced/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/object-merge-advanced/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/object-merge-advanced/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/object-merge-advanced.svg
[downloads-url]: https://www.npmjs.com/package/object-merge-advanced

[vulnerabilities-img]: https://snyk.io/test/github/codsen/detergent/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/detergent
