# html-entities-not-email-friendly

> All HTML entities which are not email template friendly

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![no dependencies][no-deps-img]][no-deps-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Idea / TLDR](#idea--tldr)
- [Plain object `notEmailFriendly`](#plain-object-notemailfriendly)
- [Set `notEmailFriendlySetOnly`](#set-notemailfriendlysetonly)
- [Set `notEmailFriendlyLowercaseSetOnly`](#set-notemailfriendlylowercasesetonly)
- [Constants `notEmailFriendlyMinLength` and `notEmailFriendlyMaxLength`](#constants-notemailfriendlyminlength-and-notemailfriendlymaxlength)
- [API](#api)
- [In practice](#in-practice)
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
  notEmailFriendlySetOnly,
  notEmailFriendlyLowercaseSetOnly,
  notEmailFriendlyMinLength,
  notEmailFriendlyMaxLength
} = require("html-entities-not-email-friendly");
```

or as an ES Module:

```js
import {
  notEmailFriendly,
  notEmailFriendlySetOnly,
  notEmailFriendlyLowercaseSetOnly,
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
  notEmailFriendlySetOnly,
  notEmailFriendlyLowercaseSetOnly,
  notEmailFriendlyMinLength,
  notEmailFriendlyMaxLength
} = htmlEntitiesNotEmailFriendly;
```

This package has three builds in `dist/` folder:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/html-entities-not-email-friendly.cjs.js` | 75 KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/html-entities-not-email-friendly.esm.js` | 82 KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/html-entities-not-email-friendly.umd.js` | 65 KB

**[⬆ back to top](#)**

## Idea / TLDR

Web pages are in UTF8 normally and don't need to be HTML-encoded.

Email templates are sent over SMTP and normally need to be HTML encoded.

HTML encoding can be done three ways: decimal (`&#163;`), hexadecimal (`&#xA3;`) and named forms (`&pound;`).

The named entities can be memorised or recognised more easily than numeric-ones. When we check the template's text, `&pound;` is more informative than `&#163;`. If somebody mistakenly put `&#164;` you would not tell easily, but `&pund;` stands out instantly!

The only problem is, **not all named entities are supported well across all email clients**, in particular, in Windows desktop Outlooks.

This package tells **which entities exactly and not supported widely** and tells you what to convert them to.

This program exports few different lists:

- `notEmailFriendly` — a plain object, key value pairs are like `AMP: "amp"` — total keys: 1841
- `notEmailFriendlySetOnly` — a [Set](https://exploringjs.com/impatient-js/ch_sets.html) of only entity names (in correct letter case) — total size: 1841
- `notEmailFriendlyLowercaseSetOnly` — an alphabetically sorted [Set](https://exploringjs.com/impatient-js/ch_sets.html) of lowercase entity names — total size: 1534

**[⬆ back to top](#)**

## Plain object `notEmailFriendly`

```js
const { notEmailFriendly } = require("html-entities-not-email-friendly");
// it's a plain object of key-value pairs where key is entity name, value is
// decoded numeric entity analogue of it
console.log(Object.keys(notEmailFriendly).length);
// => 1841
```

The point of plain object `notEmailFriendly` is to decode the entities.

For example, among the keys you can see:

```json
And: "#x2A53",
```

This means, named HTML entity `&And;` is not email friendly and should be put as `&#x2A53;`.

As you noticed, ampersands and semicolons are missing in keys and values (but they're obligatory in HTML code so add them yourself).

**[⬆ back to top](#)**

## Set `notEmailFriendlySetOnly`

[Sets](https://exploringjs.com/impatient-js/ch_sets.html) are awesome because they're fast.

When you import `notEmailFriendlySetOnly`, it's a Set of only the key names:

```js
const { notEmailFriendlySetOnly } = require("html-entities-not-email-friendly");
for (const entitysName of notEmailFriendlySetOnly) {
  console.log(entitysName);
}
// => "AMP",
//    "Abreve",
//    ...

// another example: check is given entity a valid HTML named entity string?
console.log(notEmailFriendlySetOnly.has("tralala"));
// => false - no "tralala" (if put fully, &tralala;) is not a recognised named HTML entity's name

console.log(notEmailFriendlySetOnly.has("Aogon"));
// => true - yes "Aogon" (if put fully, &Aogon;) is a recognised named HTML entity's name
```

You must use Set methods: `has`, `size` etc on `notEmailFriendlySetOnly`. It's not an array, it's a set.

**[⬆ back to top](#)**

## Set `notEmailFriendlyLowercaseSetOnly`

`notEmailFriendlyLowercaseSetOnly` is also a Set but all values are lowercase and sorted.

The idea is that if you have a named HTML entity and suspect that its letter case might be messed up, you lowercase it and match against this Set. Now, if something is found, do actions matching against plain object keys in `notEmailFriendly` (aiming to decode to numeric entities), OR matching against a Set with exact case, `notEmailFriendlySetOnly` (if value is not found, letter case in your entity is messed up).

```js
const { notEmailFriendlySetOnly } = require("html-entities-not-email-friendly");
for (const entitysName of notEmailFriendlySetOnly) {
  console.log(entitysName);
}
// => "AMP",
//    "Abreve",
//    ...
```

**[⬆ back to top](#)**

## Constants `notEmailFriendlyMinLength` and `notEmailFriendlyMaxLength`

Their point is to give you guidance how long or short entities can be:

```js
const {
  notEmailFriendlyMinLength,
  notEmailFriendlyMaxLength,
} = require("html-entities-not-email-friendly");
console.log(
  `The shortest length in the set is: ${notEmailFriendlyMinLength} and longest is ${notEmailFriendlyMaxLength}.`
);
// => The shortest length in the set is: 2 and longest is 31.
```

Keep in mind, `length` here does not count ampersand and semicolon. For example, `Abreve` length is 6 characters but in the HTML, it is 8: `&Abreve;`,

**[⬆ back to top](#)**

## API

This package exports a plain object with five keys:

- `notEmailFriendly`
- `notEmailFriendlySetOnly`
- `notEmailFriendlyLowercaseSetOnly`
- `notEmailFriendlyMinLength`
- `notEmailFriendlyMaxLength`

| Key's name                         | Key's value's type | Purpose                                                                                                             |
| ---------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `notEmailFriendly`                 | plain object       | Plain object of all named HTML entities. The key is an entity's name; value is a raw decoded entity. 1841 in total. |
| `notEmailFriendlySetOnly`          | set                | A set of all entity names, in correct case, unsorted. 1841 in total.                                                |
| `notEmailFriendlyLowercaseSetOnly` | set                | A set of all entity names, in lowercase, sorted. 1534 in total (because we have `AMP` and `amp` for example).       |
| `notEmailFriendlyMinLength`        | natural number     | the string length of the shortest of all entities, currently hardcoded to `2`                                       |
| `notEmailFriendlyMaxLength`        | natural number     | the string length of the longest of all entities, currently hardcoded to `31`                                       |

**[⬆ back to top](#)**

## In practice

This program allows [Detergent](https://detergent.io) to automatically switch between named and numeric HTML entities, prioritising on named, if they're supported (acccording this program).

Detergent's competitor, [Email on Acid Character Converter](https://app.emailonacid.com/character-converter/) only uses numeric entities and therefore is an inferior product.

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

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/html-entities-not-email-friendly
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/html-entities-not-email-friendly
[no-deps-img]: https://img.shields.io/badge/-no%20dependencies-brightgreen?style=flat-square
[no-deps-url]: https://www.npmjs.com/package/html-entities-not-email-friendly?activeTab=dependencies
[downloads-img]: https://img.shields.io/npm/dm/html-entities-not-email-friendly.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/html-entities-not-email-friendly
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/html-entities-not-email-friendly
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
