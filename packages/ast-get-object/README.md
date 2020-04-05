# ast-get-object

> Getter/setter for nested parsed HTML AST's, querying objects by key/value pairs

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Purpose](#purpose)
- [API](#api)
- [For example, reading or querying parsed trees (GET)](#for-example-reading-or-querying-parsed-trees-get)
- [Writing-over example (SET)](#writing-over-example-set)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i ast-get-object
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`getObj`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const getObj = require("ast-get-object");
```

or as an ES Module:

```js
import getObj from "ast-get-object";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ast-get-object/dist/ast-get-object.umd.js"></script>
```

```js
// in which case you get a global variable "astGetObject" which you consume like this:
const getObj = astGetObject;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                         | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ast-get-object.cjs.js` | 3 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ast-get-object.esm.js` | 2 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ast-get-object.umd.js` | 18 KB |

**[⬆ back to top](#)**

## Purpose

When you parse some HTML using [posthtml-parser](https://github.com/posthtml/posthtml-parser), you get an array which contains a nested [tree](https://github.com/posthtml/posthtml-parser#posthtml-ast-format) of strings, objects and arrays. This library lets you query that tree. Later, if you amend and feed this query result again into the `get` as a _third_ argument, you can overwrite the search results. Basically, search and overwrite right away.

In short, two arguments is GET the results, three arguments is SET (or write over) whatever was queried.

Normally you would use this library to get tags from parsed HTML trees, edit the result and later write it over.

**[⬆ back to top](#)**

## API

```js
getObj(input, keyValPair, replacementContentsArr);
```

### API - Input

| Input argument           | Type         | Obligatory? | Description                                                                                                                                        |
| ------------------------ | ------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`                  | Whatever     | yes         | AST tree, or object or array or whatever. Can be deeply-nested.                                                                                    |
| `keyValPair`             | Plain object | yes         | Key/value pairs to look for.                                                                                                                       |
| `replacementContentsArr` | Arrray       | no          | The array of new values to set the findings objects. Those values can even be massive nested trees of plain objects and arrays. It doesn't matter. |

**[⬆ back to top](#)**

### API - Output

Output depends on is it GET mode — 2 arguments, or SET mode — 3 arguments.

- If it's **GET mode**, result will be an array of parent objects that hold key/value pairs you asked.

- If it's **SET mode**, result will be of the same type as your input, but with all plain objects that had your key/value pairs replaced with contents of third, replacement array. Mind you, if you will supply too few elements in the replacements array, this library won't do anything to those findings.

**[⬆ back to top](#)**

## For example, reading or querying parsed trees (GET)

Let's GET all plain objects that contain key `tag` and value `meta`. In a true parsed-HTML fashion, everything is in an array, and there are other plain objects around:

```js
const result = getObj(
  [
    // <- search in this, the first argument, in this case, a nested array
    {
      tag: "meta",
      content: "UTF-8",
      something: "else",
    },
    {
      tag: "title",
      attrs: "Text of the title",
    },
  ],
  {
    // <- search for this object, the second argument
    tag: "meta",
  }
);
```

`result` — each parent object that holds your requested key/value pair(s) is put into an array:

```js
[
  {
    tag: "meta",
    content: "UTF-8",
    something: "else",
  },
];
```

All findings are always wrapped in an array, even if there's just one finding as above.

**[⬆ back to top](#)**

## Writing-over example (SET)

**Task**: take this nested array of plain objects:

```js
[
  {
    tag: ["two", "values"],
    content: "UTF-8",
    something: "else",
  },
  {
    tag: "title",
    attrs: "Text of the title",
  },
];
```

Find all plain objects that contain key `tag` and value `['two', 'values']` (so value is an array!).

Replace all those plain objects with:

```js
{
  tag: ['three', 'values', 'here'],
  content: 'UTF-8',
  something: 'else'
}
```

---

Solution:

```js
getObj(
  [
    {
      tag: ["two", "values"],
      content: "UTF-8",
      something: "else",
    },
    {
      tag: "title",
      attrs: "Text of the title",
    },
  ],
  {
    tag: ["two", "values"],
  },
  [
    {
      tag: ["three", "values", "here"],
      content: "UTF-8",
      something: "else",
    },
  ]
);
```

PS. Notice that replacement is put into an array. Also, keep in mind that array is like a cartridge — it will expect a separate value for each finding, so we're OK in this case — there was one finding, and one replacement in our array "cartridge".

Result of the above will be:

```js
[
  {
    tag: ["three", "values", "here"],
    content: "UTF-8",
    something: "else",
  },
  {
    tag: "title",
    attrs: "Text of the title",
  },
];
```

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-get-object%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-get-object%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-get-object%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-get-object%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ast-get-object%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aast-get-object%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-get-object
[cov-img]: https://img.shields.io/badge/coverage-95.56%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ast-get-object
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-get-object
[downloads-img]: https://img.shields.io/npm/dm/ast-get-object.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-get-object
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-get-object
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
