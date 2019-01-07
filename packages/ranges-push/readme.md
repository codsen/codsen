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
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ranges-push.cjs.js` | 9 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ranges-push.esm.js` | 7 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ranges-push.umd.js` | 35 KB |

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

**PS.** Later, when you're finished with your operations, and you want your string crunched according to your newly-generated array of slices, use [ranges-apply](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-apply) to do the actual deletion/replacement job. It consumes your ranges array and performs all the deletion/replacement tasks on the string at once.

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

The Optional Options Object is validated by [check-types-mini](https://bitbucket.org/codsen/codsen/src/master/packages/check-types-mini), so please behave: the settings' values have to match the API and settings object should not have any extra keys, not defined in the API. Naughtiness will cause error `throw`s. I know, it's strict, but it prevents any API misconfigurations and helps to identify some errors early-on.

Here is the Optional Options Object in one place (in case you ever want to copy it):

```js
{
  limitToBeAddedWhitespace: false,
  limitLinebreaksCount: 1
}
```

You then interact with your newly-created slices class by calling its _methods_:

**[⬆ back to top](#markdown-header-ranges-push)**

### slices.add(from, to[, str])

alias - **.push**

| Input argument | Type                    | Obligatory? | Description                                                                                                                                           |
| -------------- | ----------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deleteFrom`   | Integer, natural number | yes         | Beginning index of the slice                                                                                                                          |
| `deleteTo`     | Integer, natural number | yes         | Ending index of the slice                                                                                                                             |
| `str`          | String                  | no          | If you want not only to delete but [insert](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-apply) something, put that new string here |

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

Imagine: `[ [10, 20, 'aaa'], [10, 15, bbb]]` was merged by `.current`, and became `[ [10, 20, 'bbbaaa'] ]`. Now if you use this range in [ranges-apply](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-apply) to amend the string, but then later discover that you left out the range `[12, 17, ccc]`, that is, you wanted to delete between indexes 12 and 17, and then insert `ccc`, you'll be in trouble. Since you amended your string, you can't "stick in" `ccc` between original `bbb` and `aaa` — your desired place to add `ccc`, at index 17 has been "merged" by `bbb` and `aaa`.

**Conclusion**: complete all your operations, `add()`-ing ranges. Then, fetch your master ranges array _once_, using `.current` and feed it into [ranges-apply](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-apply). At this point don't do any more `add()`ing, or if you really want that, process the ranges you've got using [ranges-apply](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-apply), `wipe()` everything and start `add()`ing again.

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

PSST. Later, feed your ranges array into [ranges-apply](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-apply) to delete/replace all those ranges in your string.

**[⬆ back to top](#markdown-header-ranges-push)**

## In my case

Originally this library was part of [email-comb](https://bitbucket.org/codsen/codsen/src/master/packages/email-comb), but I tore it off and placed into a separate (this) library when I needed the same function in [html-img-alt](https://bitbucket.org/codsen/codsen/src/master/packages/html-img-alt). Since then, [Detergent](https://bitbucket.org/codsen/codsen/src/master/packages/detergent) also uses it, so its unit test wouldn't take an hour, calculating all possible combinations of the options, while input string is mutated again and again in the for a loop.

This library is part one of two library combo, second one being [ranges-apply](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-apply).

**[⬆ back to top](#markdown-header-ranges-push)**

## Contributing

- If you see an error, [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=ranges-push%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=ranges-push%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=ranges-push%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://bitbucket.org/codsen/codsen/src/) via BitBucket, then write code, then file a pull request via BitBucket. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#markdown-header-ranges-push)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/ranges-push.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ranges-push
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/codsen/src/master/packages/ranges-push
[cov-img]: https://img.shields.io/badge/coverage-100%-brightgreen.svg?style=flat-square
[cov-url]: https://bitbucket.org/codsen/codsen/src/master/packages/ranges-push
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-push
[downloads-img]: https://img.shields.io/npm/dm/ranges-push.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-push
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-push
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/codsen/src/master/LICENSE
