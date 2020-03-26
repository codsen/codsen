<div align="center">
  <h1>🐒<br>ast-monkey-traverse-with-lookahead</h1>
</div>

<div align="center"><p>Utility library to traverse parsed HTML (AST's) or anything nested (plain objects within arrays within plain objects)</p></div>

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

- Check out the parent library which does even more: `ast-monkey` ([npm](https://www.npmjs.com/package/ast-monkey)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey/))

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [API](#api)
- [Stopping](#stopping)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i ast-monkey-traverse-with-lookahead
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`traverse2`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const traverse2 = require("ast-monkey-traverse-with-lookahead");
```

or as an ES Module:

```js
import traverse2 from "ast-monkey-traverse-with-lookahead";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ast-monkey-traverse-with-lookahead/dist/ast-monkey-traverse-with-lookahead.umd.js"></script>
```

```js
// in which case you get a global variable "astMonkeyTraverseWithLookahead" which you consume like this:
const traverse2 = astMonkeyTraverseWithLookahead;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                             | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------ | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ast-monkey-traverse-with-lookahead.cjs.js` | 3 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ast-monkey-traverse-with-lookahead.esm.js` | 2 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ast-monkey-traverse-with-lookahead.umd.js` | 10 KB |

**[⬆ back to top](#)**

## Idea

Original `ast-monkey-traverse` ([npm](https://www.npmjs.com/package/ast-monkey-traverse)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-traverse/)) had means to edit the AST and couldn't give you the next few values that's coming up. It only "saw" the current thing it traversed.

While working on `codsen-parser` ([npm](https://www.npmjs.com/package/codsen-parser)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/codsen-parser/)), I found that: A) I don't need AST editing functionality (perf win) and B) I need to see what nodes are coming next.

Instead of bloating `ast-monkey-traverse` ([npm](https://www.npmjs.com/package/ast-monkey-traverse)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-traverse/)) and slowing it down, I decided to create alternative flavour of it, this program.

**[⬆ back to top](#)**

## API

`traverse2()` is a function. It traverses AST tree given to it in the first input argument. You use it via a callback (arrow function `(key, val, innerObj, stop) => {...}` below for example), similar way to `Array.forEach()`:

```js
const traverse2 = require("ast-monkey-traverse-with-lookahead");
var ast = [{ a: "a", b: "b" }];
traverse2(ast, (key, val, innerObj, stop) => {
  console.log(`key = ${JSON.stringify(key, null, 4)}`);
  console.log(`val = ${JSON.stringify(val, null, 4)}`);
  console.log(`innerObj = ${JSON.stringify(innerObj, null, 4)}`);
});
```

Unlike in `ast-monkey-traverse` ([npm](https://www.npmjs.com/package/ast-monkey-traverse)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-traverse/)), this program is read-only so you don't need to return anything inside the callback.

You can't delete or change values of AST in this program.

**[⬆ back to top](#)**

#### innerObj in the callback

When you call `traverse2()` like this:

```js
traverse2(input, function (key, val, innerObj, stop) {
  ...
})
```

you get four variables:

- `key`
- `val`
- `innerObj`
- `stop` - set `stop.now = true;` to stop the traversal

If `traverse2()` is currently traversing a plain object, going each key/value pair, `key` will be the object's current key and `val` will be the value.
If `traverse2()` is currently traversing an array, going through all elements, a `key` will be the current element and `val` will be `null`.

| `innerObj` object's key | Type                                                  | Description                                                                                                                                                                                                                                                                                                                                     |
| ----------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{`                     |                                                       |
| `depth`                 | Integer number                                        | Zero is root, topmost level. Every level deeper increments `depth` by `1`.                                                                                                                                                                                                                                                                      |
| `path`                  | String                                                | The path to the current value. The path uses exactly the same notation as the popular [object-path](https://www.npmjs.com/package/object-path) package. For example, `a.1.b` would be: input object's key `a` > value is array, take `1`st index (second element in a row, since indexes start from zero) > value is object, take it's key `b`. |
| `topmostKey`            | String                                                | When you are very deep, this is the topmost parent's key.                                                                                                                                                                                                                                                                                       |
| `parent`                | Type of the parent of current element being traversed | A whole parent (array or a plain object) which contains the current element. Its purpose is to allow you to query the **siblings** of the current element.                                                                                                                                                                                      |
| `parentType`            | String                                                | Either `array` if parent is array or `object` if parent is **a plain object** (not the "object" type, which includes functions, arrays etc.).                                                                                                                                                                                                   |
| `}`                     |                                                       |

**[⬆ back to top](#)**

## Stopping

Here's how to stop the traversal. Let's gather all the traversed paths first. By the way, paths are marked in [object-path](https://www.npmjs.com/package/object-path) notation (arrays use dots too, `a.1.b` instead of `a[1].b`).

```js
const traverse2 = require("ast-monkey-traverse-with-lookahead");
const input = { a: "1", b: { c: "2" } };
const gathered = [];
traverse2(input, (key1, val1, innerObj) => {
  const current = val1 !== undefined ? val1 : key1;
  gathered.push(innerObj.path);
  return current;
});
console.log(gathered);
// => ["a", "b", "b.c"]
```

All paths were gathered: `["a", "b", "b.c"]`.

Now let's make the monkey to stop at the path "b":

```js
const traverse2 = require("ast-monkey-traverse-with-lookahead");
const input = { a: "1", b: { c: "2" } };
const gathered = [];
traverse2(input, (key1, val1, innerObj, stop) => {
  const current = val1 !== undefined ? val1 : key1;
  gathered.push(innerObj.path);
  if (innerObj.path === "b") {
    stop.now = true; // <---------------- !!!!!!!!!!
  }
  return current;
});
console.log(gathered);
// => ["a", "b"]
```

Notice how there were no more gathered paths after "b", only `["a", "b"]`.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-monkey-traverse-with-lookahead%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-monkey-traverse-with-lookahead%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-monkey-traverse-with-lookahead%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-monkey-traverse-with-lookahead%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-monkey-traverse-with-lookahead%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-monkey-traverse-with-lookahead%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-traverse-with-lookahead
[cov-img]: https://img.shields.io/badge/coverage-94.87%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-traverse-with-lookahead
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-monkey-traverse-with-lookahead
[downloads-img]: https://img.shields.io/npm/dm/ast-monkey-traverse-with-lookahead.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-monkey-traverse-with-lookahead
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-monkey-traverse-with-lookahead
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
