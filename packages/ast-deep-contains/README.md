# ast-deep-contains

> the t.deepEqual alternative for AVA

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

- Check out the parent library which does even more: `ast-monkey` [npm](https://www.npmjs.com/package/ast-monkey)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey/)

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [API](#api)
- [Contrived Example](#contrived-example)
- [Real World Example](#real-world-example)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i ast-deep-contains
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`deepContains`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const deepContains = require("ast-deep-contains");
```

or as an ES Module:

```js
import deepContains from "ast-deep-contains";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ast-deep-contains/dist/ast-deep-contains.umd.js"></script>
```

```js
// in which case you get a global variable "astDeepContains" which you consume like this:
const deepContains = astDeepContains;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                            | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ast-deep-contains.cjs.js` | 2 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ast-deep-contains.esm.js` | 1 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ast-deep-contains.umd.js` | 15 KB |

**[⬆ back to top](#)**

## Idea

For AST's (nested arrays and objects), AVA the unit test runner gives only one comparison method — `t.deepEqual`.

It's not practical when new keys are added over time to the "left side" of `t.deepEqual`.

For example, in `codsen-tokenizer` ([npm](https://www.npmjs.com/package/codsen-tokenizer)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer/)) which drives the `EMLint` the email linter `emlint` ([npm](https://www.npmjs.com/package/emlint)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/emlint/)) — pretty much every new linter's rule will require new additions to tokenizer and every new addition to the tokenizer's output will make `deepEqual` comparisons fail.

This package is not tied to AVA though, callback functions are universal and API can be adapted to other uses.

**[⬆ back to top](#)**

## API

**deepContains(tree1, tree2, cb, errCb\[, opts])**

in other words, it's a function which takes 5 input arguments:

| Input argument | Type                                        | Obligatory? | Description                                                                                                            |
| -------------- | ------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| `tree1`        | reference AST, can be superset of `tree2`   | yes         | Array, object or nested thereof                                                                                        |
| `tree2`        | AST being checked, can be subset of `tree1` | yes         | Array, object or nested thereof                                                                                        |
| `cb`           | function                                    | yes         | This function will be called with pairs, of values from each path. Think `t.is` of AVA. See API below.                 |
| `errCb`        | function                                    | yes         | If path does not exist on `tree1`, this callback function will be called with a message string. Think `t.fail` of AVA. |
| `opts`         | Plain object                                | no          | Optional plain object containing settings, see API below.                                                              |

**[⬆ back to top](#)**

### Options object

| `options` object's key | Type    | Default | Description                                                                                                                                                            |
| ---------------------- | ------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                      |         |         |
| `skipContainers`       | Boolean | `true`  | During traversal, containers (arrays and objects) will be checked for existence and traversed further but callback won't be pinged. Set to `false` to stop doing that. |
| }                      |         |         |

**[⬆ back to top](#)**

### `opts.skipContainers`

Consider these two AST's, for example:

Object 1:

```json
{
  "a": {
    "b": "c"
  }
}
```

Object 2:

```json
{
  "a": {
    "b": "d"
  }
}
```

During traversal, _monkey_ will check for existence of path "a" on Object 1 but won't report the values `{"b": "c"}` and `{"b": "d"}`. This way, when using this program in unit test context, AVA's `t.is` can be passed and we would be matching the values only. Missing paths would get reported to AVA's `t.fail`.

Let me repeat, no matter the setting on `opts.skipContainers`, in example above, the existence of the `a` will be checked, it's just that the values, objects, won't be passed to a callback, because they might be not equal either — first one might be superset!

**[⬆ back to top](#)**

### Output

Output is `undefined` — this program is used exclusively through callbacks. Those do the job — function does not return anything.

## Contrived Example

```js
const gathered = [];
const errors = [];

deepContains(
  { a: "1", b: "2", c: "3" },
  { a: "1", b: "2" },
  (leftSideVal, rightSideVal) => {
    gathered.push([leftSideVal, rightSideVal]);
  },
  err => {
    errors.push(err);
  }
);

console.log(JSON.stringify(gathered, null, 4));
// => [["1", "1"], ["2", "2"]]

console.log(JSON.stringify(errors, null, 4));
// => []
```

**[⬆ back to top](#)**

## Real World Example

Here's an example from codsen-tokenizer. Tokenizer's API is callback-based, it will feed your callback function with tokens (plain objects), one by one. Unit test is set up so that callback stashes the tokens into an array. AVA would be called to compare the contents of that array.

Now, the fun part is, if we used `t.deepEqual`, if we added new keys in a tokenizer, let's if instead of old set of keys:

```json
{
  "type": "text",
  "start": 0,
  "end": 2,
  "tail": null,
  "kind": null
}
```

we added a new key, `tagName`, for example, `t.deepEqual` assertion would fail.

But `deepContains` is fine with that, as long as all paths from the 2nd argument are present in the 1st, it will ping `t.is` with those values (`opts.skipContainers` prevents arrays or objects from being passed into the callback, although paths existence is still checked).

```js
test("01.01 - text-tag-text", t => {
  const gathered = [];
  ct("  <a>z", obj => {
    gathered.push(obj);
  });

  deepContains(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 2,
        tail: null,
        kind: null
      },
      {
        type: "html",
        start: 2,
        end: 5,
        tail: null,
        kind: null
      },
      {
        type: "text",
        start: 5,
        end: 6,
        tail: null,
        kind: null
      }
    ],
    t.is,
    t.fail
  );
});
```

Here you go, an alternative for AVA's `t.deepEqual`.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-deep-contains%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-deep-contains%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-deep-contains%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-deep-contains%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-deep-contains%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-deep-contains%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/ast-deep-contains.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ast-deep-contains
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-deep-contains
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-deep-contains
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-deep-contains
[downloads-img]: https://img.shields.io/npm/dm/ast-deep-contains.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-deep-contains
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-deep-contains
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
