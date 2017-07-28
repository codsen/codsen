# string-slices-array-push

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Manage the array of slices referencing the index ranges within the string

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
  - [slices.add(from, to[, str])](#slicesaddfrom-to-str)
  - [slices.current()](#slicescurrent)
  - [slices.wipe()](#sliceswipe)
  - [slices.last()](#sliceslast)
- [In my case](#in-my-case)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
$ npm i -S string-slices-array-push
```

```js
const Slices = require('string-slices-array-push')
let slices = new Slices()
slices.add(1, 2)
slices.add(2, 4)
console.log(slices.last())
// => [ [1, 4] ]
slices.add(10, 20)
console.log(slices.current())
// => [ [1, 4], [10, 20] ]
```

## Idea

Imagine you want to delete a bunch of characters from a string. Like making a bunch of holes in a slice of cheese. An ineffective way is to traverse that string and mutate it on each "hole". The effective way is to gather the indexes of `[from, to]` ranges in an array while traversing, and when string traversal is done, perform all cutting **in one go**. It's like using ten pencils to make ten holes in a slice, all at once. OK, bad example, but you get it. All in one go. That's the plan.

Sounds good.

Challenge: how do you manage those string index ranges?

`[deleteFrom1, deleteTo1]`, `[deleteFrom2, deteleTo2]` and so on.

It's easy when you push non-overlapping ranges, but what happens when an incoming range is overlapping the previous-one? Like if `deleteFrom2` is less than `deleteTo1`?

What happens if both "start" and "end" values of a new range are lower the previous-one's? Like if `deleteFrom2` < `deleteTo2` < `**deleteTo1**`?

How do you prevent damage when the same range is added multiple times?

---

**The answer:** this library.

---

**PS.** Later, when you finished with your operations, and you want your string crunched according to your newly-generated array of slices, use [string-replace-slices-array](https://github.com/codsen/string-replace-slices-array) to do the actual deletion/replacement job.

## API

This package exports a constructor, Slices which you first `require`, then call using `new`:

```js
const Slices = require('string-slices-array-push')
let slices = new Slices()
```

The `slices` (with lowercase) is your [class](https://github.com/getify/You-Dont-Know-JS/blob/master/es6%20%26%20beyond/ch3.md#classes) which contains your slice ranges and gives you methods to get/set the values.

You then interact with it calling its _methods_:

### slices.add(from, to[, str])

Input argument | Type                    | Obligatory? | Description
---------------|-------------------------|-------------|--------------------
`deleteFrom`   | Integer, natural number | yes         | Beginning index of the slice
`deleteTo`     | Integer, natural number | yes         | Ending index of the slice
`str`          | String                  | no          | If you want not only to delete but [insert](https://github.com/codsen/string-replace-slices-array) something, put that new string here.

If you want only to insert and you don't want to delete anything, put both `deleteFrom` and `deleteTo` **the same**.

* If the arguments are of a wrong type, it will `throw` and error.
* Also, if you _overload_ it, providing fourth, fifth input argument and so on if will `throw` too. It's for your safety because that might flag up something wrong happening in your program.

### slices.current()

This method fetches the **current** state of your slices array.

Result is either

1) array of slice range arrays like:

```js
[ // notice it's an array of arrays
  [10, 20, ' insert this']
  [30, 50],
  [51, 55]
]
```

2) or `null` if it's still empty and nothing has been added since.

### slices.wipe()

Sets your slices array to `null`. Right after that `slices.current()` will yield `null`.

### slices.last()

Outputs:

1) the last ranges' array from the slices array, for example:

```js
[51, 55]
```

2) Or, if there's nothing in the slices array yet, `null`.

---


PSST. Later, use [string-replace-slices-array](https://github.com/codsen/string-replace-slices-array) to crunch your string using the `slices.current`.

## In my case

Originally this library was part of [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css/), but I tore it off and placed into a separate (this) library when I needed the same function in [html-img-alt](https://github.com/codsen/html-img-alt).

This library is part one of two library combo, second one being [string-replace-slices-array](https://github.com/codsen/string-replace-slices-array).

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/string-slices-array-push/issues). If you file a pull request, I'll do my best to help you to get it merged as soon as possible. If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email.

If something doesn't work as you wished or you don't understand the inner working of this library, do raise an issue. I'm happy to explain what's happening. Often some part of my README documentation is woolly, and I can't spot it myself. I need user feedback.

Also, if you miss a feature, request it by [raising](https://github.com/codsen/string-slices-array-push/issues) an issue as well.

Cheers!

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

[travis-img]: https://travis-ci.org/codsen/string-slices-array-push.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/string-slices-array-push

[cov-img]: https://coveralls.io/repos/github/codsen/string-slices-array-push/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-slices-array-push?branch=master

[bithound-img]: https://www.bithound.io/github/codsen/string-slices-array-push/badges/score.svg
[bithound-url]: https://www.bithound.io/github/codsen/string-slices-array-push

[deps-img]: https://www.bithound.io/github/codsen/string-slices-array-push/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/string-slices-array-push/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/string-slices-array-push/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/string-slices-array-push/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/string-slices-array-push.svg
[downloads-url]: https://www.npmjs.com/package/string-slices-array-push
