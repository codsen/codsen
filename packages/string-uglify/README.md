# string-uglify

> Uglify - generate unique short names for sets of strings

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
- [Main feature - it's not position-sensitive](#main-feature-its-not-position-sensitive)
- [Other features](#other-features)
- [Usage](#usage)
- [API](#api)
- [uglification vs minification](#uglification-vs-minification)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-uglify
```

Consume via a `require()`:

```js
const { uglifyById, uglifyArr, version } = require("string-uglify");
```

or as an ES Module:

```js
import { uglifyById, uglifyArr, version } from "string-uglify";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-uglify/dist/string-uglify.umd.js"></script>
```

```js
// in which case you get a global variable "stringUglify" which you consume like this:
const { uglifyById, uglifyArr, version } = stringUglify;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                        | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-uglify.cjs.js` | 5 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-uglify.esm.js` | 5 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-uglify.umd.js` | 3 KB |

**[⬆ back to top](#)**

## Idea

This library takes array of strings and uglifies them:

```js
[".module", ".class1", ".class2"];
```

into something like:

```js
[".g", ".j5", ".s9"];
```

## Main feature - it's not position-sensitive

### Basic algorithm

A basic uglification algorithm looks like this: take an array of class/id names, first-one gets name `a`, second `b`. After 26 letters are depleted, the next name gets `aa` and so on.

Problem with this algorithm is that when you add or remove some classes from code, all others "below" in the list get shifted — their names change.

Practically, this means, if you add a single new class high-enough, there will be code changes _all over the file_.

Besides being simple, the second strength of such algorithm is that length-wise, class/id names are the shortest possible.

**[⬆ back to top](#)**

### Our algorithm

This program generates uglified names differently. It uses a special formula to turn the unique sequence of letters and their positions into another, unique combination of two or more letters.

In this approach, if you add, remove or shuffle strings in the input array, up to 0.1% of the uglified values might change.

The drawback of this algorithm is that class/id names start at two-characters length and if that combination is taken, get three-character (or, with increasingly lesser probability, longer) names.

Single-letter names are assigned during the cleanup phase: existing single-character names are left untouched, the remaining pool of letters is distributed the following way.

We scan the list of uglified result names and check their first letter. If that letter is not taken, that name gets shortened to one letter.

**[⬆ back to top](#)**

## Other features

- Its API is friendly - no errors are thrown, wrong inputs won't give you results. An empty array is fine.
- Put dots and hashes (`.a` and `#a`) or don't. If you are minifying only classes or only id's you might omit dot or hash.
- Input reference strings array does not have to contain unique entries. It's just inefficient to have duplicates so you should aim to avoid that.

**[⬆ back to top](#)**

## Usage

```js
const { uglifyArr } = require("string-uglify");
// notice we put dots and hashes for classes and id's but algorithm will work
// fine too if you won't.
const names = [
  ".module-promo-all",
  ".module-promo-main",
  ".module-promo-second",
  "#zzz"
];
const res = uglifyArr(names);
console.log("res = " + JSON.stringify(res1, null, 0));
// => [".m', ".b", ".r", #a]

// uglify a particular id number:
const res2 = uglifyById(names, 3);
console.log("res2 = " + JSON.stringify(res2, null, 4));
// => "#a"
```

**[⬆ back to top](#)**

## API

When you `require`/`import`, you get three things:

```js
const { uglifyArr, uglifyById, version } = require("string-uglify");
```

### uglifyArr() - returns copy of a given array with each string uglified

**Input** — anything.
If it's not an array, the same thing will be instantly returned.
If it's array, an array is returned.
If it's an array of one or more strings, it will return an array of that many uglified strings.

**Output** - same type as **input**.
If it's a non-empty array of strings, those strings will be uglified.

If you feed strings **with** dots/hashes, `[".class1", "#id2", ".class2", "#id9"]` output will have same dots/hashes, for example, `[".m", "#b", ".r", "#aa"]`.

If you feed input **without** dots/hashes, `["name1", "name2", "name3"]`, output will be without dots/hashes. For example, `["m", "b", "r", "aa"]`.

See the usage example above.

**[⬆ back to top](#)**

### uglifyById() - clones and uglifies array and returns uglified element by requested id

Input — two arguments: array and natural number index.

Output - uglified string (string from position "id").

uglifyById() is less efficient when called many times because each time it processes the whole array using `uglifyArr()` and then gives you the id you requested. You should aim to avoid using `uglifyById()` and instead uglify the whole array, assign the result to a variable and query the element you need from it.

See the usage example above.

**[⬆ back to top](#)**

### version

It outputs the _semver_ string straight from `package.json`'s "version" key's value.

For example:

```js
const { version } = require("string-uglify");
console.log(`string-uglify from npm has version: ${version}`);
// string-uglify from npm has version: 1.1.0
```

**[⬆ back to top](#)**

## uglification vs minification

Some people use the term "minification" and "uglification" interchangeably, but that's two different things.

**Uglification**: `.class1 { display: block; }` &rarr; `.fj { display: block; }` (rename class or id names to be shorter)

**Minification**: `.class1 { display: block; }` &rarr; `.class1{display:block}` (in CSS case, remove all the white space and sometimes last semicolon)

This library won't minify.

If you _need_ an HTML/CSS minification tool, consider [html-crush](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush) from yours truly.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-uglify%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-uglify%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-uglify%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-uglify%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-uglify%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-uglify%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/string-uglify.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-uglify
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-uglify
[cov-img]: https://img.shields.io/badge/coverage-94.87%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-uglify
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-uglify
[downloads-img]: https://img.shields.io/npm/dm/string-uglify.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-uglify
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-uglify
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
