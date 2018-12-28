# ast-get-object

> Getter/setter for nested parsed HTML AST's, querying objects by key/value pairs

[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#markdown-header-install)
- [Purpose](#markdown-header-purpose)
- [API](#markdown-header-api)
- [For example, reading or querying parsed trees (GET)](#markdown-header-for-example-reading-or-querying-parsed-trees-get)
- [Writing-over example (SET)](#markdown-header-writing-over-example-set)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```sh
npm i ast-get-object
```

```js
// consume via CommonJS require:
const getObj = require("ast-get-object");
// or import as an ES Module:
import getObj from "ast-get-object";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                         | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ast-get-object.cjs.js` | 2 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ast-get-object.esm.js` | 2 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ast-get-object.umd.js` | 33 KB |

**[⬆ back to top](#markdown-header-ast-get-object)**

## Purpose

When you parse some HTML using [posthtml-parser](https://github.com/posthtml/posthtml-parser), you get an array which contains a nested [tree](https://github.com/posthtml/posthtml-parser#posthtml-ast-format) of strings, objects and arrays. This library lets you query that tree. Later, if you amend and feed this query result again into the `get` as a _third_ argument, you can overwrite the search results. Basically, search and overwrite right away.

In short, two arguments is GET the results, three arguments is SET (or write over) whatever was queried.

Normally you would use this library to get tags from parsed HTML trees, edit the result and later write it over.

**[⬆ back to top](#markdown-header-ast-get-object)**

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

**[⬆ back to top](#markdown-header-ast-get-object)**

### API - Output

Output depends on is it GET mode — 2 arguments, or SET mode — 3 arguments.

- If it's **GET mode**, result will be an array of parent objects that hold key/value pairs you asked.

- If it's **SET mode**, result will be of the same type as your input, but with all plain objects that had your key/value pairs replaced with contents of third, replacement array. Mind you, if you will supply too few elements in the replacements array, this library won't do anything to those findings.

**[⬆ back to top](#markdown-header-ast-get-object)**

## For example, reading or querying parsed trees (GET)

Let's GET all plain objects that contain key `tag` and value `meta`. In a true parsed-HTML fashion, everything is in an array, and there are other plain objects around:

```js
const result = getObj(
  [
    // <- search in this, the first argument, in this case, a nested array
    {
      tag: "meta",
      content: "UTF-8",
      something: "else"
    },
    {
      tag: "title",
      attrs: "Text of the title"
    }
  ],
  {
    // <- search for this object, the second argument
    tag: "meta"
  }
);
```

`result` — each parent object that holds your requested key/value pair(s) is put into an array:

```js
[
  {
    tag: "meta",
    content: "UTF-8",
    something: "else"
  }
];
```

All findings are always wrapped in an array, even if there's just one finding as above.

**[⬆ back to top](#markdown-header-ast-get-object)**

## Writing-over example (SET)

**Task**: take this nested array of plain objects:

```js
[
  {
    tag: ["two", "values"],
    content: "UTF-8",
    something: "else"
  },
  {
    tag: "title",
    attrs: "Text of the title"
  }
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
      something: "else"
    },
    {
      tag: "title",
      attrs: "Text of the title"
    }
  ],
  {
    tag: ["two", "values"]
  },
  [
    {
      tag: ["three", "values", "here"],
      content: "UTF-8",
      something: "else"
    }
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
    something: "else"
  },
  {
    tag: "title",
    attrs: "Text of the title"
  }
];
```

**[⬆ back to top](#markdown-header-ast-get-object)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/ast-get-object/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/ast-get-object/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-ast-get-object)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/ast-get-object.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ast-get-object
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/ast-get-object
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/ast-get-object/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/ast-get-object?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ast-get-object
[downloads-img]: https://img.shields.io/npm/dm/ast-get-object.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ast-get-object
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ast-get-object
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/ast-get-object
