![](https://glcdn.githack.com/codsen/codsen/raw/master/packages/string-uglify/media/logo.png)

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
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-uglify
```

```js
// consume via a CommonJS require:
const { uglifyArr, uglifyById, version } = require("string-uglify");
// or as an ES Module:
import { uglifyArr, uglifyById, version } from "string-uglify";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                        | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-uglify.cjs.js` | 2 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-uglify.esm.js` | 2 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-uglify.umd.js` | 1 KB |

**[⬆ back to top](#)**

## Idea

Uglification is turning class or id names into shortest-possible ones:

`.module-promo-main` -> `.a`
`.module-promo-second` -> `.b`

Such algorithm seems easy, here's one implementation of it: https://github.com/cazzer/gulp-selectors/blob/master/lib/utils/generate-shortname.js

The problem with such algorithms is that there **all uglified class/id names are sensitive to their position in the source array**.

For example, when we add another class, `.module-promo-all`, it shifts

`.module-promo-all` -> `.a` (takes top position)
`.module-promo-main` -> `.b` (previously was `.a`)
`.module-promo-second` -> `.c` (previously was `.b`)

As a result, if you use such uglification, smallest addition or removal to any classes/id's will cause a ripple effect throughout the whole document, and there will be git diffs (changes) everywhere.

This library uglifies an array of class or id names relying only on letter values and their sequences. There is no reliance on the position of a class/id in the source array.

**[⬆ back to top](#)**

## Usage

```js
const { uglifyArr } = require("string-uglify");
const names = [
  ".module-promo-all",
  ".module-promo-main",
  ".module-promo-second",
  "#zzz"
];
const res = uglifyArr(names);
console.log("res = " + JSON.stringify(res1, null, 0));
// => [".m', ".b", ".r", #a]

// uglify only particular id:
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

### uglifyArr()

**Input** — anything. If it's not an array, it will be instantly returned. If it's array, an array is returned. If it's an array of one or more string, it will return an array of that many uglified strings.

**Output** - same thing as in the **input**, if it's a non-empty array of strings, those strings will be uglified.

If you feed strings with dots/hashes, `[".class1", "#id2", ".class2", "#id9"]` output will have same dots/hashes, for example, `[".m", "#b", ".r", "#aa"]`.

If you feed input without dots/hashes, `["name1", "name2", "name3"]`, output will be without dots/hashes. For example, `["m", "b", "r", "aa"]`.

See usage example above.

**[⬆ back to top](#)**

### uglifyById()

Input — two arguments: array and natural number (id).

Output - uglified string (string from position "id").

uglifyById() is less efficient when called many times because each time it processes the whole array using `uglifyArr()`, then gives you the id you requested. You should aim to avoid using `uglifyById()` and instead uglify the whole array, assign the result to a variable and query the element you need from it.

See usage example above.

**[⬆ back to top](#)**

### version

It outputs the _semver_ string straight from `package.json`'s "version" key's value.

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-uglify%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-uglify%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-uglify%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-uglify%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-uglify%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-uglify%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/string-uglify.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-uglify
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-uglify
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
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
