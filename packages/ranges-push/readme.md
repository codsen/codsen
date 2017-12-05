# string-slices-array-push

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Manage the array of slices referencing the index ranges within the string

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

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [The Idea](#the-idea)
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
$ npm i string-slices-array-push
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

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled, contains `require` and `module.exports` | `main`                | `dist/string-slices-array-push.cjs.js` | 4&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/string-slices-array-push.esm.js` | 4&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/string-slices-array-push.umd.js` | 21&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## The Idea

Imagine you want to delete a bunch of characters from a string. Like making a bunch of holes in a slice of cheese. An ineffective way is to traverse that string and mutate it on each "hole". The effective way is to gather the indexes of `[from, to]` ranges in an array while traversing, and when string traversal is done, perform all cutting **in one go**. It's like using ten pencils to make ten holes in a slice, all at once. OK, bad example, but you get it. All in one go. That's the plan.

**Challenge: how do you manage those string index ranges?**

`[deleteFromIndex1, deleteToIndex1]`, `[deleteFromIndex2, deteleToIndex2]` and so on.

- What happens when ranges overlap? We need to merge them.
- What happens if new range is located before the last-one? We need to sort them.
- How do you prevent damage when the same range is added multiple times?
- What happens if you want not only to delete, but also, **to add** something? We need to accept third argument, the value to add.
- What happens if you want to only add something, without deletion? We need to accept first and second argument as the same index.

---

**The solution to all these challenges above is...** this library.

---

**PS.** Later, when you're finished with your operations, and you want your string crunched according to your newly-generated array of slices, use [string-replace-slices-array](https://github.com/codsen/string-replace-slices-array) to do the actual deletion/replacement job. It consumes your ranges array and performs all the deletion/replacement tasks on the string at once.

**[⬆ &nbsp;back to top](#)**

## API

This package exports a constructor, Slices which you first `require`, then call using `new`:

```js
const Slices = require('string-slices-array-push')
let slices = new Slices()
```

The `slices` (with lowercase) is your [class](https://github.com/getify/You-Dont-Know-JS/blob/master/es6%20%26%20beyond/ch3.md#classes) which contains your slice ranges and gives you methods to get/set the values.

You then interact with it calling its _methods_:

**[⬆ &nbsp;back to top](#)**

### slices.add(from, to[, str])

Input argument | Type                    | Obligatory? | Description
---------------|-------------------------|-------------|--------------------
`deleteFrom`   | Integer, natural number | yes         | Beginning index of the slice
`deleteTo`     | Integer, natural number | yes         | Ending index of the slice
`str`          | String                  | no          | If you want not only to delete but [insert](https://github.com/codsen/string-replace-slices-array) something, put that new string here

If you want only to insert and you don't want to delete anything, put both `deleteFrom` and `deleteTo` **the same**.

* If the arguments are of a wrong type, it will `throw` and error.
* Also, if you _overload_ it, providing fourth, fifth input argument and so on if will `throw` too. It's for your own safety because it might flag up something wrong happening in your code.

In essence, `.add()` behaves two ways:

1) `.add(1, 2)`, later `.add(2, 3)` will not create a new `[2, 3]` but extend `[1, 2]` into `[1, 3]`. This is to save time because we prevent bunch of connecting ranges from being recorded as separate ones.
2) all other cases, if it's not an exact extension of a previous range, new range is added into the array. `.add(2, 3)`, later `.add(1, 2)` will result in `[ [2, 3], [1, 2] ]`. The `.current()` method will clean it later. Read on...

Additionally, when `.add` merges two ranges and one completely overlaps another, the superset (larger) range will wipe out any "to-add" (third-argument) values of the subset (smaller) range(s).

**[⬆ &nbsp;back to top](#)**

### slices.current()

This method fetches the **current** state of your slices array, sorts and **merges it**, then outputs it to you.

Result is either

1) array of slice range arrays like:

```js
[ // notice it's an array of arrays
  [10, 20, ' insert this string after deleting range between indexes 10 & 20']
  [30, 50],
  [51, 55]
]
```

2) or `null` if it's still empty and nothing has been added since.

`.current()` will do the sorting first by `deleteFrom` (first element), then, sorting by `deleteTo` (second element), **then**, it will merge any ranges that overlap.

```js
[[4, 5], [1, 2]] => [[1, 2], [4, 5]] // no overlap, so just sorted by 1st element
```

```js
[[2, 5], [2, 3], [1, 10]] => [[1, 10]] // there was an overlap, so ranges were merged
```

In theory, since `.current()` does not mutate our slices array in the memory, you could add more ranges and call `.current()` again, this time possibly with slightly different result. However, be aware that merging will lose some of the data in the ranges.

Imagine: `[ [10, 20, 'aaa'], [10, 15, bbb]]` was merged by `.current`, and became `[ [10, 20, 'bbbaaa'] ]`. Now if you use this range in [string-replace-slices-array](https://github.com/codsen/string-replace-slices-array) to amend the string, but then later discover that you left out the range `[12, 17, ccc]`, that is, you wanted to delete between indexes 12 and 17, and then insert `ccc`, you'll be in trouble. Since you amended your string, you can't "stick in" `ccc` between original `bbb` and `aaa` — your desired place to add `ccc`, at index 17 has been "merged" by `bbb` and `aaa`.

**Conclusion**: complete all your operations, `add()`-ing ranges. Then, fetch your master ranges array _once_, using `.current` and feed it into [string-replace-slices-array](https://github.com/codsen/string-replace-slices-array). At this point don't do any more `add()`ing, or if you really want that, process the ranges you've got using [string-replace-slices-array](https://github.com/codsen/string-replace-slices-array), `wipe()` everything and start `add()`ing again.

**[⬆ &nbsp;back to top](#)**

### slices.wipe()

Sets your slices array to `null`. Right after that `slices.current()` will yield `null`. You can then start `add`-ing again, from scratch.

### slices.last()

Outputs:

1) the last ranges' array from the slices array, for example:

```js
[51, 55]
```

2) Or, if there's nothing in the slices array yet, `null`.

---


PSST. Later, feed your ranges array into [string-replace-slices-array](https://github.com/codsen/string-replace-slices-array) to delete/replace all those ranges in your string.

**[⬆ &nbsp;back to top](#)**

## In my case

Originally this library was part of [email-remove-unused-css](https://github.com/codsen/email-remove-unused-css/), but I tore it off and placed into a separate (this) library when I needed the same function in [html-img-alt](https://github.com/codsen/html-img-alt). Since then, [Detergent](https://github.com/codsen/detergent) also uses it, so its unit test wouldn't take an hour, calculating all possible combinations of the options, while input string is mutated again and again in the for loop.

This library is part one of two library combo, second one being [string-replace-slices-array](https://github.com/codsen/string-replace-slices-array).

**[⬆ &nbsp;back to top](#)**

## Contributing

Hi! 99% of people in the society are passive - consumers. They wait for others to take action, they prefer to blend in. The remaining 1% are proactive citizens who will _do_ something rather than _wait_. If you are one of that 1%, you're in luck because I am the same and _together_ we can make something happen.

* If you **want a new feature** in this package or you would like to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/string-slices-array-push/issues). Also, you can [email me](mailto:roy@codsen.com). Just let it out.

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/string-slices-array-push/issues). Alternatively, you can [email me](mailto:roy@codsen.com).

* If you don't like the code in here and would like to **give an advice** about how something could be done better, please do. Same drill - [GitHub issues](https://github.com/codsen/string-slices-array-push/issues) or [email](mailto:roy@codsen.com), your choice.

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. I'll do my best to merge it quickly. Code style is `airbnb`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2017 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-slices-array-push.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-slices-array-push

[npm-img]: https://img.shields.io/npm/v/string-slices-array-push.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/string-slices-array-push

[travis-img]: https://img.shields.io/travis/codsen/string-slices-array-push.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/string-slices-array-push

[cov-img]: https://coveralls.io/repos/github/codsen/string-slices-array-push/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/string-slices-array-push?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/string-slices-array-push.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/string-slices-array-push

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/string-slices-array-push.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/string-slices-array-push/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-slices-array-push

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/string-slices-array-push.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/string-slices-array-push/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/string-slices-array-push/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/string-slices-array-push

[downloads-img]: https://img.shields.io/npm/dm/string-slices-array-push.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-slices-array-push

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-slices-array-push

[license-img]: https://img.shields.io/npm/l/string-slices-array-push.svg?style=flat-square
[license-url]: https://github.com/codsen/string-slices-array-push/blob/master/license.md
