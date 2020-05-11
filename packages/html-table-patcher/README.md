# html-table-patcher

> Wraps any content between TR/TD tags in additional rows/columns to appear in browser correctly

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
- [API](#api)
- [The algorithm](#the-algorithm)
- [Using the GUI tap](#using-the-gui-tap)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i html-table-patcher
```

Consume via a `require()`:

```js
const { patcher, defaults, version } = require("html-table-patcher");
```

or as an ES Module:

```js
import { patcher, defaults, version } from "html-table-patcher";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/html-table-patcher/dist/html-table-patcher.umd.js"></script>
```

```js
// in which case you get a global variable "htmlTablePatcher" which you consume like this:
const { patcher, defaults, version } = htmlTablePatcher;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                             | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/html-table-patcher.cjs.js` | 8 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/html-table-patcher.esm.js` | 6 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/html-table-patcher.umd.js` | 86 KB |

**[⬆ back to top](#)**

## Idea

Very often, templating languages (or PHP or Email Service Providers' back-end code) is inserted in-between the HTML table tags: between `table` and `tr`, between `tr` and `td` and so on. If you open such HTML in a browser, that inserted code will appear at wrong places because the browser will try to patch it up (but will do it incorrectly).

This library patches the HTML, so the browser in the correct places renders that code between the table cells.

The patched code is not meant for production by any means - it's for visual display in a browser only!

This library takes _string_ (hopefully some HTML) and outputs patched up _string_, so it's not an _end tool_, it's rather an API for a feature in other tools and browser plugins.

**[⬆ back to top](#)**

## API

This package exports a plain objects with three keys: `{ patcher, defaults, version }`.

The first-one has a value which is the main function.
The second-one is the defaults (plain) object.
The third-one is the version taken straight from `package.json`

For example:

```js
// import ES6 style, if you want to consume this package as an ES module:
import { patcher, defaults, version } from "html-table-patcher";
const result = patcher("<table>1<tr><td>zzz</td></tr></table>");
console.log(`result = "${result}"`);
// => "<table><tr><td>1</td></tr><tr><td>zzz</td></tr></table>"
console.log(`current version of the API is: v${version}`);
// => current version of the API is: v1.0.15
console.log(`default settings are:\n${defaults}`);
// =>
// {
//   "cssStylesContent": "",
//   "alwaysCenter": false
// }
```

You can import whole package as a single variable and call its methods:

```js
// for example, using CommonJs require():
const tablePatcher = require("html-table-patcher");
// now that you have "tablePatcher", call its methods:
console.log(`tablePatcher.version = ${tablePatcher.version}`);
// => "1.0.15"
console.log(tablePatcher.patcher("<table><tr>zzz<td>a</td></tr></table>"));
// => "<table>..."
```

**[⬆ back to top](#)**

### patcher() API

Main function, `patcher(str[, opts])`, takes two input arguments and returns a string of zero or more characters in length.

| Input argument | Key value's type | Obligatory? | Description                                        |
| -------------- | ---------------- | ----------- | -------------------------------------------------- |
| `str`          | String           | yes         | The input string of zero or more characters        |
| `opts`         | Plain object     | no          | An Optional Options Object. See below for its API. |

**[⬆ back to top](#)**

### `patcher` options

Put options under function's second input argument, in a plain object, as per defaults:

```js
import { patcher, defaults, version } from "html-table-patcher";
const result = patcher("<table>1<tr><td>zzz</td></tr></table>", {
  // <---- options object
  cssStylesContent: "",
  alwaysCenter: false,
});
```

Here's the options object's API:

| Options Object's key | Value's type | Default value       | Description                                                                                            |
| -------------------- | ------------ | ------------------- | ------------------------------------------------------------------------------------------------------ |
| {                    |              |                     |
| `cssStylesContent`   | string       | `""` (empty string) | Whatever you put here, will end up on every newly-added TD's inline `style` tag's value                |
| `alwaysCenter`       | boolean      | `false`             | Every newly-added TD should have its contents centered (via an inline `align="center"` HTML attribute) |
| }                    |              |                     |

**[⬆ back to top](#)**

## The algorithm

We parse using `htmlparser2` and use `domutils` to patch a new DOM which we later render using `dom-serializer`.

## Using the GUI tap

When developing features, it's handy to have a GUI to be able to test multiple variations of input, quickly. Using unit tests is slow because you edit unit test's input, plus output is via unit test runner which is not perfect.

We set up a rudimentary front-end GUI. To run it, run the server from the root of this package, for example, using `serve` CLI (https://www.npmjs.com/package/serve). After you fire up the server, for example `http://localhost:9000`, navigate to folder `tap/`, for example, `http://localhost:9000/tap`. This will serve the `tap/index.html` from package's folder. It is wired up to consume the live UMD build from `dist/` folder, so it's handy to test new features.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=html-table-patcher%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ahtml-table-patcher%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=html-table-patcher%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ahtml-table-patcher%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=html-table-patcher%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ahtml-table-patcher%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/html-table-patcher
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/html-table-patcher
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/html-table-patcher
[downloads-img]: https://img.shields.io/npm/dm/html-table-patcher.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/html-table-patcher
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/html-table-patcher
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
