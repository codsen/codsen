# ranges-apply

> Take an array of string slice ranges, delete/replace the string according to them

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
- [Idea](#markdown-header-idea)
- [API](#markdown-header-api)
- [The algorithm](#markdown-header-the-algorithm)
- [In my case](#markdown-header-in-my-case)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i ranges-apply
```

```js
// consume as CommonJS require:
const replaceSlicesArr = require("ranges-apply");
// or as ES Module:
import replaceSlicesArr from "ranges-apply";
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/ranges-apply.cjs.js` | 5 KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/ranges-apply.esm.js` | 4 KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/ranges-apply.umd.js` | 32 KB

**[⬆  back to top](#markdown-header-ranges-apply)**

## Idea

Let's say you want to delete bunch of characters from a string and also to replace some. Technically, this means you need to mark the **indexes** of the characters where you start deletion and where you end.

For example, in this string, "a" has index `7` and "e" has index `14`.

```
some example text
0123456789   13
          10  14
           11  15
            12  16
```

If you want to do something to the word "example" above, that's characters between indexes `5` and `12`. You can easily see them if you select the string - good code editors will report the index of the end of the selection in the status bar. Like Atom for example:

![finding_range_indexes_in_atom](https://bitbucket.org/codsen/ranges-apply/raw/86c4014e0534576d9b8089c6f8ef57720c8f1d7c/media/finding_range_indexes_in_atom.gif)

That's two numbers to put into an array. They mark a _slice_ of string. Let's add a third element into that array - what to put instead. If it's blank, nothing will be added (it becomes a deletion operation), if it's a non-empty string, it will be inserted insted of the deleted characters (it becomes a **replacement operation**).

```js
[
  [10, 15], // <-- delete this string slice range
  [18, 20, "replace with this"] // <-- delete from 18th to 20th, then insert string there
];
```

Now what happens when you have a few slices? You put them into an _array_.

This library consumes such parent arrays and does the actual job of crunching your string - "punching holes" and/or adding more letters.

Now, let's do it practically. Slice ranges match `String.slice()` indexing, so you can always check, does the slice you want correspond to the indexes you've got.

```js
const repl = require("ranges-apply");
let str = "aaa delete me bbb and me too ccc";
// we preview the slice #1, "delete me", is it actually indexes from 4 to 13:
console.log("slice 1: >>>" + str.slice(4, 13) + "<<<");
// preview slice #2, "and me too", is it actually indexes from 18 to 28:
console.log("slice 2: >>>" + str.slice(18, 28) + "<<<\n");
//
// then instruct this library to replace each with `zzz` and `yyy`:
str = repl(str, [[4, 13, "zzz"], [18, 28, "yyy"]]);
console.log("str = " + str);
// => 'aaa zzz bbb yyy ccc',
```

If you omit the third argument, characters depicted by that index range will be deleted.

If you just want something inserted at a given index but nothing deleted, set both "from" and "to" as that index. For example, this range instructs to insert characters "abc" into string at position `10`:

```js
[10, 10, "abc"];
```

**[⬆  back to top](#markdown-header-ranges-apply)**

## API

**stringReplaceSlicesArray(inputString, rangesArray\[, progressFn])** — in other words, this library gives you a _function_ and you must feed a string (`inputString`, above) into its first argument and a ranges array (`rangesArray`, above.). Also, if you wish, you can feed a third argument, a _progressFn_ (bracket in `[, progressFn]` means "optional").

Function returns a string with requested slices deleted/replaced.

**[⬆  back to top](#markdown-header-ranges-apply)**

#### inputString - 1st argument

**Type**: `string` - the string we want to work on.

#### rangesArray - 2nd argument

**Type**:

- `array` - the array of zero or more arrays containing a range and an optional replacement string.
- `null` - alternatively, it can be given as `null`. That's the alternative output of range classes in [ranges-push](https://www.npmjs.com/package/ranges-push).

For example,

```js
[
  [10, 15], // <-- deletion
  [18, 20, "replace with this"] // <-- replacement
];
```

**PSST.** Check out [ranges-push](https://bitbucket.org/codsen/ranges-push) which helps to manage the `rangesArray`. It has methods to add and retrieve the slices. Also, it helps in cases where slices overlap and helps to maintain the order of index ranges (it always goes from smallest to largest index, everywhere).

**[⬆  back to top](#markdown-header-ranges-apply)**

#### progressFn - 3rd argument

This optional third input argument is used in worker setups where user wants to report the progress of the job. If a function is passed as third input argument, it will be called with first argument, natural number, which means percentage done so far (from `0` to `100`).

**[⬆  back to top](#markdown-header-ranges-apply)**

## The algorithm

The plan is simple - we `array.reduce` your given ranges array, slicing the input string accordingly.

The main thing is unit tests and edge case scenarios. Also, fancy optional features (upcoming) like using character enumeration counting emoji as one character.

**[⬆  back to top](#markdown-header-ranges-apply)**

## In my case

Originally this library was part of [email-remove-unused-css](https://bitbucket.org/codsen/email-remove-unused-css/), where I traversed HTML as a string and compiled an array of things to delete or replace later, in one go. The performance was important, so it was not a good idea to delete/replace things on the spot because each deletion slowed down the process. Instead, I traversed the string, compiled this _to-do_ array, then did the deletion/replacement on the whole thing, **once**. This appears to be the fastest way.

I'm going to use this library in all my HTML processing libraries who work on HTML as on string, without parsing it.

**[⬆  back to top](#markdown-header-ranges-apply)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/ranges-apply/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/ranges-apply/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆  back to top](#markdown-header-ranges-apply)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt



[node-img]: https://img.shields.io/node/v/ranges-apply.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ranges-apply

[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/ranges-apply

[cov-img]: https://coveralls.io/repos/bitbucket/codsen/ranges-apply/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/ranges-apply?branch=master

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-apply

[downloads-img]: https://img.shields.io/npm/dm/ranges-apply.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-apply

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-apply

[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io

[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/ranges-apply
