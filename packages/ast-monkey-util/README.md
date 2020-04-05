<div align="center">
  <h1>🐒<br>ast-monkey-util</h1>
</div>

<div align="center"><p>Utility library of AST helper functions</p></div>

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

- Check out the parent library which does even more: `ast-monkey` ([npm](https://www.npmjs.com/package/ast-monkey)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey/))

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [API - `pathNext`](#api-pathnext)
- [API - `pathPrev`](#api-pathprev)
- [API - `pathUp`](#api-pathup)
- [`object-path` notation](#object-path-notation)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i ast-monkey-util
```

Consume via a `require()`:

```js
const { pathNext, pathPrev, pathUp } = require("ast-monkey-util");
```

or as an ES Module:

```js
import { pathNext, pathPrev, pathUp } from "ast-monkey-util";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ast-monkey-util/dist/ast-monkey-util.umd.js"></script>
```

```js
// in which case you get a global variable "astMonkeyUtil" which you consume like this:
const { pathNext, pathPrev, pathUp } = astMonkeyUtil;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                          | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ast-monkey-util.cjs.js` | 2 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ast-monkey-util.esm.js` | 1 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ast-monkey-util.umd.js` | 1 KB |

**[⬆ back to top](#)**

## Idea

`codsen-parser` ([npm](https://www.npmjs.com/package/codsen-parser)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/codsen-parser/)) and `emlint` ([npm](https://www.npmjs.com/package/emlint)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/emlint/)) both use [`object-path`](https://www.npmjs.com/package/object-path) notation. This utility program contains helper functions to traverse the paths.

Conceptually, we'd use `ast-monkey-traverse` ([npm](https://www.npmjs.com/package/ast-monkey-traverse)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-traverse/)), identify the node we need, then get its path (from the same program, from callbacks), then amend that path (using this program), then use `object-path` to get/set/delete that path.

**[⬆ back to top](#)**

## API - `pathNext`

It takes (a string) path and increments the last digit:

```js
console.log(pathNext("0"));
// => "1"

console.log(pathNext("9.children.3"));
// => "9.children.4"

console.log(pathNext("9.children.1.children.0"));
// => "9.children.1.children.1"
```

**[⬆ back to top](#)**

## API - `pathPrev`

It takes (a string) path and decrements the last digit:

```js
console.log(pathPrev("0"));
// => null

console.log(pathPrev("9.children.33"));
// => "9.children.32"

console.log(pathPrev("9.children.1.children.2"));
// => "9.children.1.children.1"
```

**[⬆ back to top](#)**

## API - `pathUp`

It takes (a string) path and goes "one level" up, discarding the last two path parts:

```js
console.log(pathUp("1"));
// => null

console.log(pathUp("9.children.3"));
// => "9"

console.log(pathUp("9.children.1.children.2"));
// => "9.children.1"
```

Practically, if you think, `codsen-parser` ([npm](https://www.npmjs.com/package/codsen-parser)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/codsen-parser/)) always outputs an array. It contains zero or more plain objects, each representing a tag, a chunk of text, a comment tag and so on.

Since root element is array, paths of those plain objects are digits: `0`, `1`, `5.children.0` and so on.

In `codsen-parser` ([npm](https://www.npmjs.com/package/codsen-parser)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/codsen-parser/)) AST's, child nodes are nested within `children` key - its value is array:

The following HTML:

```html
<a>text</a>
```

Would yield AST (many keys omitted):

```json
[
  {
    "type": "tag",
    "start": 0,
    "end": 3,
    "value": "<a>",
    "attribs": [],
    "children": [
      {
        "type": "text",
        "start": 3,
        "end": 7,
        "value": "text"
      }
    ]
  },
  {
    "type": "tag",
    "start": 7,
    "end": 11,
    "value": "</a>",
    "attribs": [],
    "children": []
  }
]
```

Thus, a text node for value "text" (one with `"start": 3` above) is at the path `0.children.0` (first element's first child node) and "going up" would mean "0" - that's splitting by dot into an array and discarding the last two elements from that array, then joining it back with a dot.

```
0 . children . 0
        ^      ^
    these two are removed during the "go up" action
```

**[⬆ back to top](#)**

## `object-path` notation

The notation used in this program is based on [`object-path`](https://www.npmjs.com/package/object-path) - an array elements are marked with dot - if object's key value is an array and we want to a path of the fourth element in there, it's `key.3`, not `key[3]`.

A drawback of this notation is that keys can't be numeric strings. But the advantage of this notation is that all children are now separated with a dot - you can split by dot `String.split(".")` and quickly process the path elements, unlike JS notation with square brackets.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-monkey-util%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-monkey-util%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-monkey-util%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-monkey-util%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-monkey-util%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-monkey-util%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-util
[cov-img]: https://img.shields.io/badge/coverage-96.88%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-util
[no-deps-img]: https://img.shields.io/badge/-no%20dependencies-brightgreen?style=flat-square
[no-deps-url]: https://www.npmjs.com/package/ast-monkey-util?activeTab=dependencies
[downloads-img]: https://img.shields.io/npm/dm/ast-monkey-util.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-monkey-util
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-monkey-util
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
