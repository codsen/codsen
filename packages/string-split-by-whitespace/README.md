# string-split-by-whitespace

> Split string into array by chunks of whitespace

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-split-by-whitespace
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`splitByW`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const splitByW = require("string-split-by-whitespace");
```

or as an ES Module:

```js
import splitByW from "string-split-by-whitespace";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-split-by-whitespace/dist/string-split-by-whitespace.umd.js"></script>
```

```js
// in which case you get a global variable "stringSplitByWhitespace" which you consume like this:
const splitByW = stringSplitByWhitespace;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                     | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-split-by-whitespace.cjs.js` | 3 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-split-by-whitespace.esm.js` | 2 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-split-by-whitespace.umd.js` | 2 KB |

**[⬆ back to top](#)**

### Idea

Split by a single space is easy - use `String.split(" ")`:

```js
console.log(JSON.stringify("abc def ghi".split(" "), null, 4));
// => [
//      "abc",
//      "def",
//      "ghi"
//    ]
```

Some basics: term _whitespace_ means any character which `Strim.trim()` to a zero-length string. That's space, tab, LF (what "Enter" key places on a Mac), CR, non-breaking space and handful of others.

But sometimes you need to split the string by whitespace which does not necessarily is a single space.

```js
const splitByW = require("string-split-by-whitespace");
const result = splitByW(`\n     \n    a\t \nb    \n      \t`);
console.log(JSON.stringify(result, null, 4));
// => ["a", "b"]
```

Above, we split the string by whitespace consisting of spaces, tabs and linebreaks.

**[⬆ back to top](#)**

### API - Input

| Input argument | Type         | Obligatory? | Description                                       |
| -------------- | ------------ | ----------- | ------------------------------------------------- |
| `str`          | String       | yes         | Source string upon which to perform the operation |
| `opts`         | Plain object | no          | Optional Options Object, see below for its API    |

**[⬆ back to top](#)**

### An Optional Options Object

| Optional Options Object's key | Type of its value                  | Default | Description                                                                                                                                                                 |
| ----------------------------- | ---------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                             |                                    |         |
| `ignoreRanges`                | Array of zero or more range arrays | `[]`    | Feed zero or more string slice ranges, arrays of two natural number indexes, like `[[1, 5], [6, 10]]`. Algorithm will not include these string index ranges in the results. |
| }                             |                                    |         |

The `opts.ignoreRanges` can be an empty array, but if it contains anything else then arrays inside, error will be thrown.

**[⬆ back to top](#)**

### API - Output

Program returns array of zero or more strings. Empty string yields empty array.

### `opts.ignoreRanges`

Some basics first. When we say "heads" or "tails", we mean some templating literals that wrap a value. "heads" is frontal part, for example `{{` below, "tails" is ending part, for example `}}` below:

```jinja
Hi {{ firstName }}!
```

Now imagine that we extracted _heads_ and _tails_ and we know their ranges: `[[3, 5], [16, 18]]`. (If you select `{{` and `}}` from in front of "Hi" to where each head and tail starts and ends, you'll see that these numbers match).

Now, imagine, we want to split `Hi {{ firstName }}!` into array `["Hi", "firstname", "!"]`.

For that we need to skip two ranges, those of a head and tail.

That's where `opts.ignoreRanges` become handy.

In example below, we used library [string-find-heads-tails](https://gitlab.com/codsen/codsen/tree/master/packages/string-find-heads-tails) to extract the ranges of variables' _heads_ and _tails_ in a string, then split by whitespace:

```js
const input = "some interesting {{text}} {% and %} {{ some more }} text.";
const headsAndTails = strFindHeadsTails(
  input,
  ["{{", "{%"],
  ["}}", "%}"]
).reduce((acc, curr) => {
  acc.push([curr.headsStartAt, curr.headsEndAt]);
  acc.push([curr.tailsStartAt, curr.tailsEndAt]);
  return acc;
}, []);
const res1 = split(input, {
  ignoreRanges: headsAndTails,
});
console.log(`res1 = ${JSON.stringify(res1, null, 4)}`);
// => ['some', 'interesting', 'text', 'and', 'some', 'more', 'text.']
```

You can ignore whole variables, from _heads_ to _tails_, including variable's names:

```js
const input = "some interesting {{text}} {% and %} {{ some more }} text.";
const wholeVariables = strFindHeadsTails(
  input,
  ["{{", "{%"],
  ["}}", "%}"]
).reduce((acc, curr) => {
  acc.push([curr.headsStartAt, curr.tailsEndAt]);
  return acc;
}, []);
const res2 = split(input, {
  ignoreRanges: wholeVariables,
});
// => ['some', 'interesting', 'text.']
```

We need to perform the array.reduce to adapt to the [string-find-heads-tails](https://gitlab.com/codsen/codsen/tree/master/packages/string-find-heads-tails) output, which is in format (index numbers are only examples):

```js
[
  {
    headsStartAt: ...,
    headsEndAt: ...,
    tailsStartAt: ...,
    tailsEndAt: ...,
  },
  ...
]
```

and with the help of `array.reduce` we turn it into our format:

(first example with `res1`)

```js
[
  [headsStartAt, headsEndAt],
  [tailsStartAt, tailsEndAt],
  ...
]
```

(second example with `res2`)

```js
[
  [headsStartAt, tailsEndAt],
  ...
]
```

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-split-by-whitespace%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-split-by-whitespace%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-split-by-whitespace%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-split-by-whitespace%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-split-by-whitespace%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-split-by-whitespace%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-split-by-whitespace
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-split-by-whitespace
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-split-by-whitespace
[downloads-img]: https://img.shields.io/npm/dm/string-split-by-whitespace.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-split-by-whitespace
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-split-by-whitespace
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
