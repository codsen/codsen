# html-entities-not-email-friendly

> All HTML entities which are not email template friendly

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
- [API](#api)
- [API - `notEmailFriendly`](#api-notemailfriendly)
- [API - `notEmailFriendlyMinLength`](#api-notemailfriendlyminlength)
- [API — `notEmailFriendlyMaxLength`](#api--notemailfriendlymaxlength)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i html-entities-not-email-friendly
```

Consume via a `require()`:

```js
const {
  notEmailFriendly,
  notEmailFriendlyMinLength,
  notEmailFriendlyMaxLength
} = require("html-entities-not-email-friendly");
```

or as an ES Module:

```js
import {
  notEmailFriendly,
  notEmailFriendlyMinLength,
  notEmailFriendlyMaxLength
} from "html-entities-not-email-friendly";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/html-entities-not-email-friendly/dist/html-entities-not-email-friendly.umd.js"></script>
```

```js
// in which case you get a global variable "htmlEntitiesNotEmailFriendly" which you consume like this:
const {
  notEmailFriendly,
  notEmailFriendlyMinLength,
  notEmailFriendlyMaxLength
} = htmlEntitiesNotEmailFriendly;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                           | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/html-entities-not-email-friendly.cjs.js` | 78 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/html-entities-not-email-friendly.esm.js` | 77 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/html-entities-not-email-friendly.umd.js` | 31 KB |

**[⬆ back to top](#)**

## Idea

We're talking about email template HTML, not web page HTML here. Some named HTML entities are not shown correctly in Windows desktop Outlook.

This package tells which ones exactly.

It exports a JSON file, here are a few lines of it:

```json
{
  "AMP": "amp",
  "Abreve": "#x102",
  "Acy": "#x410"
}
```

Ampersands and semicolons are missing in the exported object. For example, "bad" named HTML entity would be `&Abreve;` and its correct version would be `&#x102;`.

**[⬆ back to top](#)**

## API

This package exports a plain object with three keys:

notEmailFriendly,
notEmailFriendlyMinLength,
notEmailFriendlyMaxLength

| Key's name                  | Key's value's type | Purpose                                                                                             |
| --------------------------- | ------------------ | --------------------------------------------------------------------------------------------------- |
| `notEmailFriendly`          | plain object       | all named HTML entities, the key is an entity's name; value is a raw decoded entity. 2125 in total. |
| `notEmailFriendlyMinLength` | natural number     | the string length of the shortest of all entities                                                   |
| `notEmailFriendlyMaxLength` | natural number     | the string length of the longest of all entities                                                    |

**[⬆ back to top](#)**

## API - `notEmailFriendly`

Exported `notEmailFriendly` is a plain object looks like this:

```js
{
  "AMP":"amp",
  "Abreve":"#x102",
  "Acy":"#x410"
}
```

The key is named after the HTML entity's name; the value is what value should be used instead (decoded or numeric HTML entity).

For example, below we log all the entities:

```js
// consume:
const { notEmailFriendly } = require("all-named-html-entities");
// list them all:
Object.keys(notEmailFriendly).forEach((entName, i) => {
  console.log(`${i} entity: &${entName};`);
});
```

**[⬆ back to top](#)**

## API - `notEmailFriendlyMinLength`

Returns natural number `2` — the length of the shortest entity names in the list. For example, `&LT;`, `&GT;` or `&Re;` (two-letter names).

We are not counting ampersand `&` and semicolon `;`.

These lengths can help to optimise some algorithms — if you know that there have to be at least two letters, you can rule out single-letter strings right away.

**[⬆ back to top](#)**

## API — `notEmailFriendlyMaxLength`

Returns a natural number `31` — the length of the longest entities in the list. For example, `&CounterClockwiseContourIntegral;` has a length of `31`.

We are not counting ampersand `&` and semicolon `;`.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=html-entities-not-email-friendly%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ahtml-entities-not-email-friendly%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=html-entities-not-email-friendly%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ahtml-entities-not-email-friendly%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=html-entities-not-email-friendly%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ahtml-entities-not-email-friendly%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/html-entities-not-email-friendly.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/html-entities-not-email-friendly
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/html-entities-not-email-friendly
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/html-entities-not-email-friendly
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/html-entities-not-email-friendly
[downloads-img]: https://img.shields.io/npm/dm/html-entities-not-email-friendly.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/html-entities-not-email-friendly
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/html-entities-not-email-friendly
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
