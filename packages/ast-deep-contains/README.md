# ast-deep-contains

> an alternative for AVA's t.same

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [Example \#1 — checking subset of keys only](#example-1--checking-subset-of-keys-only)
- [Example \#2 — matching array contents, order is random](#example-2--matching-array-contents-order-is-random)
- [API](#api)
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
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ast-deep-contains.cjs.js` | 6 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ast-deep-contains.esm.js` | 5 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ast-deep-contains.umd.js` | 15 KB |

**[⬆ back to top](#)**

## Idea

This is a fancy assertion to match arrays of objects, where order doesn't matter and the source objects might have extra keys.

Imagine the source, taken from `emlint` ([npm](https://www.npmjs.com/package/emlint)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/emlint/)):

```js
[
  {
    ruleId: "tag-is-present",
    line: 1,
    column: 4,
    severity: 2,
    idxFrom: 0,
    idxTo: 4,
    message: "h1 is not allowed.",
    fix: {
      ranges: [[0, 4]]
    }
  },
  {
    ruleId: "tag-is-present",
    line: 6,
    column: 16,
    severity: 2,
    idxFrom: 43,
    idxTo: 48,
    message: "h1 is not allowed.",
    fix: {
      ranges: [[43, 48]]
    }
  }
]
```

Matched objects are in wrong order and contain only subset of keys:

```js
[
  {
    ruleId: "tag-is-present",
    idxFrom: 43,
    idxTo: 48,
    message: "h1 is not allowed.",
    fix: {
      ranges: [[43, 48]]
    }
  },
  {
    ruleId: "tag-is-present",
    idxFrom: 0,
    idxTo: 4,
    message: "h1 is not allowed.",
    fix: {
      ranges: [[0, 4]]
    }
  },
]
```

Notice how above we don't bother with `line` and `column` values, as well as `severity`. Also, note that key structure is very similar, yet objects are in a wrong order (because rules were raised in such way).

Ava's `t.deepEqual` is exact match so 1) missing keys and 2) wrong object order in the array would be an issue.

Tap's `t.same` would match set/subset keys but would still not be able to detect that two objects are in a wrong order.

Solution is this package.

It will try to match which object is the most similar to the source's, then will not raise errors if source has extra keys.

Matching is passed to your chosen assertion functions, most likely `t.is` and `t.fail`.

## Example \#1 — checking subset of keys only

Adapted `codsen-tokenizer` ([npm](https://www.npmjs.com/package/codsen-tokenizer)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer/)) tests, if they were in Ava:

```js
const t = require("tap");
import ct from "codsen-tokenizer";
import deepContains from "ast-deep-contains";

test("01.01 — text-tag-text", t => {
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
        end: 2
        // <---- tokenizer reports way more keys than that
      },
      {
        type: "html",
        start: 2,
        end: 5
      },
      {
        type: "text",
        start: 5,
        end: 6
      }
    ],
    t.is, // each pair of keys is ran by this function
    t.fail // major failures are pinged to this function
  );
});
```

In example above, reported objects will have more keys than what's compared. Throughout the time, when improving the tokenizer we will surely add even more new keys. All this should not affect the main keys. Using `t.same` would be a nuisance — I'd have to update all unit tests each time after a new improvement to the tokenizer is done, new key is added.

**[⬆ back to top](#)**

## Example \#2 — matching array contents, order is random

Our linter `emlint` ([npm](https://www.npmjs.com/package/emlint)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/emlint/)) is pluggable — each rule is a plugin and program's architecture is based on the Observer patten — the main checking function in EMLint is extending the Node's `EventEmitter` class:

```js
class Linter extends EventEmitter {
  ...
}
```

This means, the nature in which errors are raised is somewhat undetermined. In EMLint unit tests I want to check, were correct errors raised and would the proposed string fixing index ranges fix the input.

Same way with the yard's dog and cat example, I don't care about the _order_ of the pets (linter error objects) — as long each one of the set is reported, happy days.

Behold - a program flags up two backslashes on a void HTML tag — the first backslash should be deleted, second one turned into normal slash — we don't care about the order of the elements as long as all elements were matched, plus there might be extra keys in the source objects — source objects are superset of what we're matching:

```js
const t = require("tap");
import { Linter } from "emlint";
import deepContains from "ast-deep-contains"; // <------------ this program
import { applyFixes } from "t-util/util";

const BACKSLASH = "\u005C";

t.test(
  `06.01 - ${`\u001b[${36}m${`both sides`}\u001b[${39}m`} - extreme case`,
  t => {
    const str = `<${BACKSLASH}br${BACKSLASH}>`;
    const linter = new Linter();
    // call the linter and record the result's error messages:
    const messages = linter.verify(str, {
      rules: {
        tag: 2
      }
    });
    // assertion:
    deepContains(
      // <------------ that's this program, ast-deep-contains
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 1,
          idxTo: 2,
          message: "Wrong slash - backslash.",
          fix: {
            ranges: [[1, 2]]
          }
          // <---- "messages" we're comparing against will have more keys but we don't care
        },
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 4,
          idxTo: 5,
          message: "Replace backslash with slash.",
          fix: {
            ranges: [[4, 5, "/"]]
          }
        }
      ],
      t.is, // each pair of key values is ran by this function
      t.fail // major failures are pinged to this function
    );
  }
);
```

The order in which backslashes will be reported does not matter, plus Linter might report more information — that's welcomed but will be ignored, not a cause for error.

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

| `options` object's key  | Type    | Default | Description                                                                                                                                                            |
| ----------------------- | ------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                       |         |         |
| `skipContainers`        | Boolean | `true`  | During traversal, containers (arrays and objects) will be checked for existence and traversed further but callback won't be pinged. Set to `false` to stop doing that. |
| `arrayStrictComparison` | Boolean | `false` | Objects in the array can be of random order, as long as each one is matched, order does not matter. For strict order, set to `true`.                                   |
| }                       |         |         |

Here is the defaults object, in one place, if you need to copy it:

```js
{
  skipContainers: true,
  arrayStrictComparison: false
}
```

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

### API's Output

Output is `undefined` — this program is used exclusively through callbacks. Those do the job — function does not return anything.

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
