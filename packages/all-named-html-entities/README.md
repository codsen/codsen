# all-named-html-entities

> List of all named HTML entities

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [API - `entStartsWith`](#api-entstartswith)
- [API - `decode`](#api-decode)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i all-named-html-entities
```

Consume via a `require()`:

```js
const {
  allNamedEntities,
  entStartsWith,
  entEndsWith,
  entStartsWithCaseInsensitive,
  entEndsWithCaseInsensitive,
  brokenNamedEntities,
  decode,
  minLength,
  maxLength,
  uncertain
} = require("all-named-html-entities");
```

or as an ES Module:

```js
import {
  allNamedEntities,
  entStartsWith,
  entEndsWith,
  entStartsWithCaseInsensitive,
  entEndsWithCaseInsensitive,
  brokenNamedEntities,
  decode,
  minLength,
  maxLength,
  uncertain
} from "all-named-html-entities";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/all-named-html-entities/dist/all-named-html-entities.umd.js"></script>
```

```js
// in which case you get a global variable "allNamedHtmlEntities" which you consume like this:
const {
  allNamedEntities,
  entStartsWith,
  entEndsWith,
  entStartsWithCaseInsensitive,
  entEndsWithCaseInsensitive,
  brokenNamedEntities,
  decode,
  minLength,
  maxLength,
  uncertain
} = allNamedHtmlEntities;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                  | Size   |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------- | ------ |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/all-named-html-entities.cjs.js` | 227 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/all-named-html-entities.esm.js` | 227 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/all-named-html-entities.umd.js` | 129 KB |

**[⬆ back to top](#)**

## Idea

This package exports a plain object with 11 keys:

| Key's name                     | Key's value's type | Purpose                                                                                                             |
| ------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `allNamedEntities`             | plain object       | all named HTML entities, key is entity's name, value is raw decoded entity. 2125 in total.                          |
| `entStartsWith`                | plain object       | all named HTML entities, grouped by first character, then by second                                                 |
| `entEndsWith`                  | plain object       | all named HTML entities, grouped by last character, then by second-to-last                                          |
| `entStartsWithCaseInsensitive` | plain object       | all named HTML entities, grouped by first character, then by second, both case-insensitive                          |
| `entEndsWithCaseInsensitive`   | plain object       | all named HTML entities, grouped by last character, then by second-to-last, both case insensitive                   |
| `decode`                       | function           | decodes named HTML entities (`&...;` format)                                                                        |
| `minLength`                    | integer            | length of the shortest of all named HTML entities (currently `2`)                                                   |
| `maxLength`                    | integer            | length of the longest of all named HTML entities (currently `31`)                                                   |
| `uncertain`                    | plain object       | all named HTML entities which could be interpreted as words if entity was malformed (missing ampersand for example) |

**[⬆ back to top](#)**

## API - `entStartsWith`

`entStartsWith` looks like this:

```
{
"A": {
    "E": [
        "AElig"
    ],
    "M": [
        "AMP"
    ],
    "a": [
        "Aacute"
    ],
    ...
```

The point of `entStartsWith` is that we don't have to iterate through upto 2127 entities to match. Instead, we match by first and second letter and match against that list, which varies but is on average tens of strings long.

Let's tap it.

For example, imagine, we have to check, is there a named HTML entity to the right of string index `2` in string `123Aacute456`:

```js
const { entStartsWith } = require("all-named-html-entities");

// is there a named HTML entity to the right of index 2?
const input = "123Aacute456";

// first we slice the string from third index onwards, we get "Aacute456"
const workingSlice = input.slice(3);

// this is very verbose and exaggerated code but it's for illustrative purposes

// in real life it would be shorter than all this

// define default answer, false:
let result = false;

if (
  workingSlice &&
  entStartsWith.hasOwnProperty(workingSlice[0]) &&
  entStartsWith[workingSlice[0]].hasOwnProperty(workingSlice[1]) &&
  entStartsWith[workingSlice[0]][workingSlice[1]].some(entity =>
    workingSlice.startsWith(entity)
  )
) {
  result = true;
}
console.log(`result: ${result}`);
```

```js
const { all } = require("all-named-html-entities");
console.log(Array.isArray(all));
```

**[⬆ back to top](#)**

## API - `decode`

```js
const { decode } = require("all-named-html-entities");
console.log(decode("&aleph;"));
// => ℵ
```

If the given input is not a string, or is an empty string or does not start with ampersand or does not end with semicolon, error is thrown.

Else, check is performed and if it's not found among known entities, a `null` is returned.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=all-named-html-entities%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aall-named-html-entities%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=all-named-html-entities%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aall-named-html-entities%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=all-named-html-entities%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aall-named-html-entities%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/all-named-html-entities.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/all-named-html-entities
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/all-named-html-entities
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/all-named-html-entities
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/all-named-html-entities
[downloads-img]: https://img.shields.io/npm/dm/all-named-html-entities.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/all-named-html-entities
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/all-named-html-entities
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
