<div align="center">
  <h1>lerna-clean-changelogs</h1>
</div>

<div align="center">
  <p><img alt="lerna-clean-changelogs" src="https://glcdn.githack.com/codsen/codsen/raw/master/packages/lerna-clean-changelogs/media/deleted.png" width="680" align="center"></p>
</div>

<div align="center"><p>Cleans all the crap from Lerna and Conventional Commits-generated changelogs</p></div>

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

Other siblings of this package:

- CLI for it: `lerna-clean-changelogs-cli` [on npm](https://www.npmjs.com/package/lerna-clean-changelogs-cli), [on GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/lerna-clean-changelogs-cli)

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [API - Input](#api-input)
- [API - Output](#api-output)
- [Purpose](#purpose)
- [Updating it](#updating-it)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i lerna-clean-changelogs
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`c`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const c = require("lerna-clean-changelogs");
```

or as an ES Module:

```js
import c from "lerna-clean-changelogs";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/lerna-clean-changelogs/dist/lerna-clean-changelogs.umd.js"></script>
```

```js
// in which case you get a global variable "lernaCleanChangelogs" which you consume like this:
const c = lernaCleanChangelogs;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                 | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------ | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/lerna-clean-changelogs.cjs.js` | 3 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/lerna-clean-changelogs.esm.js` | 3 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/lerna-clean-changelogs.umd.js` | 2 KB |

**[⬆ back to top](#)**

## Idea

This is a string-in, string-out application which cleans strings, which hopefully are changelog file contents. We could say it is a low-level API for other cleaning tools: websites, CLI apps and whatnot.

If you want a ready-to-use _cleaning tool_, consider the sibling CLI application of this package (which is driven by this very package) — [lerna-clean-changelogs-cli](https://www.npmjs.com/package/lerna-clean-changelogs-cli). Install it globally:

```bash
npm i -g lerna-clean-changelogs-cli
```

**[⬆ back to top](#)**

## API - Input

This package exports a function as a default, which means, you can name the `import` or `require` variable any way you like.

For example:

```js
import noodles from "lerna-clean-changelogs";
// now noodles() is the function into which you feed your changelog (as string).
```

**This function** you tapped accepts the following input arguments:

| Input argument | Key value's type | Obligatory? | Description                                 |
| -------------- | ---------------- | ----------- | ------------------------------------------- |
| `str`          | String           | yes         | The input string of zero or more characters |

If the first input argument is not a string, an error will be thrown.
If the first input argument is an empty string it's fine; an empty string will be in the result.

This library is **deliberately decoupled from the file read/write operations** because we might want to put it on the web or to drive a CLI application using it or whatever. API as string-in, string-out^ is the most universal.

^ Actually, we export a plain object, where the result is under key "`res`" because we also export other information under other keys (such as version). However, the idea is the same - string-in, string-out.

**[⬆ back to top](#)**

## API - Output

The function exported under the key `crush` will return **a plain object** where you'll find log data, result string and corresponding string ranges of all actions performed:

| Key's name | Key value's type | Description                                                          |
| ---------- | ---------------- | -------------------------------------------------------------------- |
| `version`  | String           | Version as present currently in `package.json`. For example, `1.0.0` |
| `res`      | String           | The string you gave in the input, just cleaned.                      |

**[⬆ back to top](#)**

## Purpose

This package performs the following cleaning steps:

1. It removes bump-only changelog entries that `conventional-changelog` generates. There can be many reasons For example:

   ```
   **Note:** Version bump only for package ranges-apply
   ```

   These will be deleted along with their headings.

2. It removes diff links from headings. Change the following:

   ```
   ## [2.9.1](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/compare/ranges-apply@2.9.0...ranges-apply@2.9.1) (2018-12-27)
   ```

   into:

   ```
   ## 2.9.1 (2018-12-27)
   ```

   We need to do that because those links don't work on BitBucket and, generally, are _a noise_.

3. Remove `h1` headings and turn them into `h2`, with the exception of the first, main heading of the changelog.

   For exampe, change the following:

   ```
   # [2.0.0](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/compare/ranges-apply@2.0.0...ranges-apply@1.9.1) (2018-12-27)
   ```

   into:

   ```
   ## 2.0.0 (2018-12-27)
   ```

   (notice how a second hash character added, beside link being removed)

4. Replaces two or more empty lines into one line. `conventional-changelog` itself leaves excessive whitespace. As a bonus, if line only contains whitespace characters (spaces, tabs etc.) those whitespace characters are removed. They're hard to spot but useless.

5. If existing, pre-lerna changelog entries use dashes to note list items, those dashes are updated to match `conventional-changelog` notation using asterisks.

---

We might add more cleaning features in later releases.

**[⬆ back to top](#)**

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. It's the [same update notifier](https://www.npmjs.com/package/update-notifier) that AVA and [npm](https://www.npmjs.com/package/npm) themselves use!

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=lerna-clean-changelogs%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Alerna-clean-changelogs%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=lerna-clean-changelogs%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Alerna-clean-changelogs%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=lerna-clean-changelogs%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Alerna-clean-changelogs%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/lerna-clean-changelogs.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/lerna-clean-changelogs
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/lerna-clean-changelogs
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/lerna-clean-changelogs
[downloads-img]: https://img.shields.io/npm/dm/lerna-clean-changelogs.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/lerna-clean-changelogs
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/lerna-clean-changelogs
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
