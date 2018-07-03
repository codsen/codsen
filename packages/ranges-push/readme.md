# ranges-push

> Manage the array of slices referencing the index ranges within the string

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#markdown-header-install)
- [The Idea](#markdown-header-the-idea)
- [API](#markdown-header-api)
- [In my case](#markdown-header-in-my-case)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i ranges-push
```

```js
// consume via a CommonJS require:
const Slices = require("ranges-push");
// or as an ES Module:
import Slices from "ranges-push";
```

```js
const Slices = require("ranges-push");
let slices = new Slices();
slices.add(1, 2);
slices.push(2, 4); // .push is same as .add
console.log(slices.last());
// => [ [1, 4] ]
slices.add(10, 20);
console.log(slices.current());
// => [ [1, 4], [10, 20] ]
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                      | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ranges-push.cjs.js` | 10 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ranges-push.esm.js` | 8 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ranges-push.umd.js` | 32 KB |

**[⬆ back to top](#markdown-header-ranges-push)**

## The Idea

Imagine, you want to delete bunch of characters from a string. Like making a bunch of holes in a slice of cheese. An ineffective way is to traverse that string and mutate it on each "hole". The effective way is to gather the indexes of `[from, to]` ranges in an array while traversing, and when string traversal is done, perform all cutting **in one go**. It's like using ten pencils to make ten holes in a slice, all at once. OK, bad example, but you get it. All in one go. That's the plan.

**Challenge: how do you manage those string index ranges?**

`[deleteFromIndex1, deleteToIndex1]`, `[deleteFromIndex2, deteleToIndex2]` and so on.

- What happens when ranges overlap? We need to merge them.
- What happens if new range is located before the last one? We need to sort them.
- How do you prevent damage when the same range is added multiple times?
- What happens if you want not only to delete but also, **to add** something? We need to accept the third argument, the value to add.
- What happens if you want to only add something, without deletion? We need to accept the first and second argument as the same index.

---

**The solution to all these challenges above is...** this library.

---

**PS.** Later, when you're finished with your operations, and you want your string crunched according to your newly-generated array of slices, use [string-replace-slices-array](https://bitbucket.org/codsen/string-replace-slices-array) to do the actual deletion/replacement job. It consumes your ranges array and performs all the deletion/replacement tasks on the string at once.

**[⬆ back to top](#markdown-header-ranges-push)**

## API

This package exports a constructor, Slices, which you first `require()`, then call using `new`:

```js
const Slices = require("ranges-push");
let slices = new Slices();
// or, with Optional Options Object:
let slices = new Slices({ limitToBeAddedWhitespace: true });
```

The `slices` (with lowercase) is your [class](https://github.com/getify/You-Dont-Know-JS/blob/master/es6%20%26%20beyond/ch3.md#classes) which contains your slice ranges and gives you methods to get/set the values.

You can also provide an Optional Options Object when creating the class:

**[⬆ back to top](#markdown-header-ranges-push)**

### Optional Options Object

| options object's key       | Type of its value | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------------- | ----------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                          |                   |         |
| `limitToBeAddedWhitespace` | Boolean           | `false` | If set to `true`, if to-be-added string (3rd element in the range array) contains only whitespace (`trim()`s to empty string), replace it with: either line break `\n` (if there's at least one line break or `\r` in it) or with a single space (all other cases). Same applies when we have a string, surrounded by whitespace. That whitespace will be replaced with space or line break.                                                                                                                                                                                                                                                    |
| `limitLinebreaksCount`     | Number            | `1`     | By default, if whole input is whitespace or there's leading/trailing whitespace and that whitespace contains at least one line break, whole whitespace will be turned into a single linebreak. That's because default maximum is set to `1`. If you set it to `2`, if `opts.limitToBeAddedWhitespace` is on and there are no linebreaks in the whitespace, it will be turned into a single space. If there's one linebreak within whitespace, it will be turned into single line break. If there are two linebreaks, it will be turned into two consecutive linebreaks. More linebreaks will still yield the number you set, in this case, `2`. |
| }                          |                   |         |

The Optional Options Object is validated by [check-types-mini](https://bitbucket.org/codsen/check-types-mini), so please behave: the settings' values have to match the API and settings object should not have any extra keys, not defined in the API. Naughtiness will cause error `throw`s. I know, it's strict, but it prevents any API misconfigurations and helps to identify some errors early-on.

Here is the Optional Options Object in one place (in case you ever want to copy it):

```js
{
  limitToBeAddedWhitespace: false,
}
```

You then interact with your newly-created slices class by calling its _methods_:

**[⬆ back to top](#markdown-header-ranges-push)**

### slices.add(from, to[, str])

alias - **.push**

| Input argument | Type                    | Obligatory? | Description                                                                                                                               |
| -------------- | ----------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `deleteFrom`   | Integer, natural number | yes         | Beginning index of the slice                                                                                                              |
| `deleteTo`     | Integer, natural number | yes         | Ending index of the slice                                                                                                                 |
| `str`          | String                  | no          | If you want not only to delete but [insert](https://bitbucket.org/codsen/string-replace-slices-array) something, put that new string here |

If you want only to insert and you don't want to delete anything, put both `deleteFrom` and `deleteTo` **the same**.

- If the arguments are of a wrong type, it will `throw` and error.
- Also, if you _overload_ it, providing fourth, fifth input argument and so on if will `throw` too. It's for your safety because it might flag up something wrong happening in your code.

In essence, `.add()` behaves two ways:

1.  `.add(1, 2)`, later `.add(2, 3)` will not create a new `[2, 3]` but extend `[1, 2]` into `[1, 3]`. This is to save time because we prevent bunch of connecting ranges from being recorded as separate ones.
2.  all other cases, if it's not an exact extension of a previous range, new range is added into the array. `.add(2, 3)`, later `.add(1, 2)` will result in `[ [2, 3], [1, 2] ]`. The `.current()` method will clean it later. Read on...

Additionally, when `.add` merges two ranges and one completely overlaps another, the superset (larger) range will wipe out any "to-add" (third-argument) values of the subset (smaller) range(s).

You can use either `.add` or `.push`, both do the same thing.

**[⬆ back to top](#markdown-header-ranges-push)**

### slices.current()

This method fetches the **current** state of your slices array, sorts and **merges it**, then outputs it to you.

Result is either

1.  array of slice range arrays like:

```js
[
  // notice it's an array of arrays
  [10, 20, " insert this string after deleting range between indexes 10 & 20"][
    (30, 50)
  ],
  [51, 55]
];
```

2.  or `null` if it's still empty and nothing has been added since.

`.current()` will do the sorting first by `deleteFrom` (first element), then, sorting by `deleteTo` (second element), **then**, it will merge any ranges that overlap.

```js
[[4, 5], [1, 2]] => [[1, 2], [4, 5]] // no overlap, so just sorted by 1st element
```

```js
[[2, 5], [2, 3], [1, 10]] => [[1, 10]] // there was an overlap, so ranges were merged
```

In theory, since `.current()` does not mutate our slices array in the memory, you could add more ranges and call `.current()` again, this time possibly with a slightly different result. However, be aware that merging will lose some of the data in the ranges.

Imagine: `[ [10, 20, 'aaa'], [10, 15, bbb]]` was merged by `.current`, and became `[ [10, 20, 'bbbaaa'] ]`. Now if you use this range in [string-replace-slices-array](https://bitbucket.org/codsen/string-replace-slices-array) to amend the string, but then later discover that you left out the range `[12, 17, ccc]`, that is, you wanted to delete between indexes 12 and 17, and then insert `ccc`, you'll be in trouble. Since you amended your string, you can't "stick in" `ccc` between original `bbb` and `aaa` — your desired place to add `ccc`, at index 17 has been "merged" by `bbb` and `aaa`.

**Conclusion**: complete all your operations, `add()`-ing ranges. Then, fetch your master ranges array _once_, using `.current` and feed it into [string-replace-slices-array](https://bitbucket.org/codsen/string-replace-slices-array). At this point don't do any more `add()`ing, or if you really want that, process the ranges you've got using [string-replace-slices-array](https://bitbucket.org/codsen/string-replace-slices-array), `wipe()` everything and start `add()`ing again.

**[⬆ back to top](#markdown-header-ranges-push)**

### slices.wipe()

Sets your slices array to `null`. Right after that `slices.current()` will yield `null`. You can then start `add`-ing again, from scratch.

### slices.last()

Outputs:

1.  the last ranges' array from the slices array, for example:

```js
[51, 55];
```

2.  Or, if there's nothing in the slices array yet, `null`.

---

PSST. Later, feed your ranges array into [string-replace-slices-array](https://bitbucket.org/codsen/string-replace-slices-array) to delete/replace all those ranges in your string.

**[⬆ back to top](#markdown-header-ranges-push)**

## In my case

Originally this library was part of [email-remove-unused-css](https://bitbucket.org/codsen/email-remove-unused-css/), but I tore it off and placed into a separate (this) library when I needed the same function in [html-img-alt](https://bitbucket.org/codsen/html-img-alt). Since then, [Detergent](https://bitbucket.org/codsen/detergent) also uses it, so its unit test wouldn't take an hour, calculating all possible combinations of the options, while input string is mutated again and again in the for a loop.

This library is part one of two library combo, second one being [string-replace-slices-array](https://bitbucket.org/codsen/string-replace-slices-array).

**[⬆ back to top](#markdown-header-ranges-push)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/ranges-push/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/ranges-push/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-ranges-push)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/ranges-push.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ranges-push
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/ranges-push
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/ranges-push/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/ranges-push?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-push
[downloads-img]: https://img.shields.io/npm/dm/ranges-push.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-push
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-push
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/ranges-push
