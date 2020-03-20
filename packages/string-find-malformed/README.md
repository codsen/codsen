# string-find-malformed

> Search for a malformed string. Think of Levenshtein distance but in search.

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Problem](#problem)
- [Idea](#idea)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-find-malformed
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`strFindMalformed`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const strFindMalformed = require("string-find-malformed");
```

or as an ES Module:

```js
import strFindMalformed from "string-find-malformed";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-find-malformed/dist/string-find-malformed.umd.js"></script>
```

```js
// in which case you get a global variable "stringFindMalformed" which you consume like this:
const strFindMalformed = stringFindMalformed;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-find-malformed.cjs.js` | 6 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-find-malformed.esm.js` | 5 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-find-malformed.umd.js` | 13 KB |

**[⬆ back to top](#)**

## Usage

Below, we look for dodgy cases of `<!--`, our callback is pinged with a location of the culprit:

```js
const strFindMalformed = require("string-find-malformed");
const gathered = [];
strFindMalformed(
  "<div><!-something--></div>",
  "<!--",
  // your callback function:
  obj => {
    gathered.push(obj);
  },
  {
    maxDistance: 1 // default
  }
);
console.log(JSON.stringify(gathered, null, 4));
// => [
//      {
//        idxFrom: 5,
//        idxTo: 8
//      }
//    ]
```

**[⬆ back to top](#)**

## Problem

We need a program to help to find malformed string instances.

For example, consider opening HTML comment tag, `<!--`.

There can be many things wrong with it:

- Missing characters from the set, for example, `<--` or `<!-`
- Rogue characters present between characters in the set, for example: `<!-.-` or `<z!--`
- Also rogue whitespace characters: `<! --` or `<!--`

Basically, something too similar to what we are looking for, but not exactly the same.

Technically, that's a lot to cover - and this program does all that.

**[⬆ back to top](#)**

## Idea

[Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) is a number which signifies, how many character changes is needed to turn one string into another.

In technical terms, for example, we would look for a set of characters Levenshtein distance `1`, but disregarding the whitespace.

Difference between `dog`, `dot` is `1` ("g" needs to be changed into "t").

Another thing, not all characters are equal (sorry for a pun) - a whitespace should/could be disregarded. For example, five spaces is not the same as _any five characters_: `<! --` is definitely an instance of malformed `<!--` but `<!<a id--` is very weird - even though both might be Levenshtein distance 5.

**Takeaway** - program will aggressively chomp the whitespace but it will be sensitive to all other characters.

**[⬆ back to top](#)**

## API

**strFindMalformed(str, refStr, cb, \[opts])**

In other words, above we say first three arguments are obligatory and fourth is optional (marked with square brackets).

### API - Input

| Input argument | Type         | Obligatory? | Description                                                                           |
| -------------- | ------------ | ----------- | ------------------------------------------------------------------------------------- |
| `str`          | String       | yes         | The string in which you want to perform a search                                      |
| `refStr`       | String       | yes         | What to look for                                                                      |
| `cb`           | Function     | yes         | You supply a callback function. It will be called on each finding. See its API below. |
| `opts`         | Plain object | no          | An Optional Options Object. See its API below.                                        |

PS. Input arguments are not mutated.

**[⬆ back to top](#)**

### Optional Options Object

| options object's key | Type of its value      | Default | Description                                                                                   |
| -------------------- | ---------------------- | ------- | --------------------------------------------------------------------------------------------- |
| {                    |                        |         |
| `stringOffset`       | Natural number or zero | `0`     | Every index fed to the callback will be incremented by this much.                             |
| `maxDistance`        | Natural number or zero | `1`     | Controls, how many characters can differ before we disregard the particular chunk as a result |
| `maxDistance`        | Boolean                | `true`  | Whitepace (characters that trim to zero length) is skipped by default.                        |

}

Here is the Optional Options Object in one place with all default settings:

```js
{
  stringOffset: 0, // this number will be added to every index reported to the callback
  maxDistance: 1, // how many characters can differ before we disregard that chunk
  ignoreWhitespace: true // if character trims to zero length, we skip on default setting
}
```

**[⬆ back to top](#)**

### API - 3rd argument - callback

The third input argument is a callback function that you supply. When a result is found, this function is called and a plain object is passed to function's first argument.

For example:

```js
// we create an empty array to dump the results into
const gathered = [];
// we call the function
strFindMalformed(
  // first input argument: source
  "abcdef",
  // second input argument: what to look for but mangled
  "bde",
  // callback function:
  obj => {
    gathered.push(obj);
  },
  // empty options object:
  {}
);
console.log(gathered);
// => [
//      {
//        idxFrom: 1,
//        idxTo: 5
//      }
//    ]

// you can double-check with String.slice():
console.log(abcdef.slice(1, 5));
// => "bcde"
// it's mangled because rogue letter "c" is between the "good" letters.
```

The result above means, mangled `bde` is present in `abcdef` on indexes range from `1` to `5`. The indexes follow the same principles as in `String.slice()`.

**[⬆ back to top](#)**

### API - Output

Returns an array of zero or more plain objects, each having format:

```js
{
  idxFrom: 1,
  idxTo: 5
}
```

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-find-malformed%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-find-malformed%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-find-malformed%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-find-malformed%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-find-malformed%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-find-malformed%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-find-malformed
[cov-img]: https://img.shields.io/badge/coverage-93.15%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-find-malformed
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-find-malformed
[downloads-img]: https://img.shields.io/npm/dm/string-find-malformed.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-find-malformed
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-find-malformed
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
