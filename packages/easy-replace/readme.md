# easy-replace

> Replace strings with optional lookarounds, but without regexes

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
- [Usage](#usage)
- [API](#api)
- [Examples](#examples)
- [Rationale](#rationale)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i easy-replace
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`er`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const er = require("easy-replace");
```

or as an ES Module:

```js
import er from "easy-replace";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/easy-replace/dist/easy-replace.umd.js"></script>
```

```js
// in which case you get a global variable "easyReplace" which you consume like this:
const er = easyReplace;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                       | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/easy-replace.cjs.js` | 9 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/easy-replace.esm.js` | 10 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/easy-replace.umd.js` | 34 KB |

**[⬆ back to top](#)**

## Usage

The ideal use case for `easy-replace` is when you need complex lookarounds, such as "replace this only when there is something on the left, but also, if there's some things on the right, include them too, yet there can't be such and such on the right". Yes, you could solve this using a regex ([if it exists at all](#rationale)), but it's faster to skip regex solutions and simply use this library.

**[⬆ back to top](#)**

## API

```js
er(source_string, options_object, replacement_string);
```

### API - Input

<!-- prettier-ignore-start -->

| Input argument       | Type         | Obligatory? | Description     |
| -------------------- | ------------ | ----------- | --------------- |
| `source_string`      | String       | yes         | Original string |
| `options_object`     | Plain Object | yes         | Settings        |
| `replacement_string` | String       | no          | Replace all the findings with this. If missing, library runs on _delete-only mode_, it won't replace, just delete. |

<!-- prettier-ignore-end -->

**[⬆ back to top](#)**

#### Options object:

<!-- prettier-ignore-start -->

| Options object's key | Type                    | Obligatory? | Description |
| -------------------- | ----------------------- | ----------- | ----------- |
| `{`                  |                         |             |
| `leftOutsideNot`     | String/Array of strings | no          | Equivalent of regex negative lookbehind. This/these string(s) must **not be** present to the left of `searchFor` (plus any "maybe's" strings, see below), in order for `searchFor` to be counted as "found". This input's contents are not replaced/deleted.  |
| `leftOutside`        | String/Array of strings | no          | Equivalent of regex positive lookbehind. This/these string(s) must **be** present to the left of `searchFor` (plus any "maybe's" strings, see below), in order for `searchFor` to be counted as "found". This input's contents are not replaced/deleted.      |
| `leftMaybe`          | String/Array            | no          | If this is present on the left side of the `searchFor`, replace/delete it together with `searchFor`, but don't fret if it's not found. |
| `searchFor`          | String only             | yes         | The keyword to look for in the `source_string` |
| `rightMaybe`         | String/Array of strings | no          | If this is present on the right side of the `searchFor`, replace/delete it together with `searchFor`, but don't fret if it's not found. |
| `rightOutside`       | String/Array of strings | no          | Equivalent of regex positive lookahead. This/these string(s) must **be** present to the right of `searchFor` (plus any "maybe's" strings, see higher), in order for `searchFor` to be counted as "found". This input's contents are not replaced/deleted.     |
| `rightOutsideNot`    | String/Array of strings | no          | Equivalent of regex negative lookahead. This/these string(s) must **not be** present to the right of `searchFor` (plus any "maybe's" strings, see higher), in order for `searchFor` to be counted as "found". This input's contents are not replaced/deleted. |
| `i`                  | Plain object            | no          | Each key mentioned above can be set to a Boolean `true`/`false` to optionally be case-insensitive. Same thing as `i` flag in regexes. |
| `}`                  |                         |             |

<!-- prettier-ignore-end -->

**[⬆ back to top](#)**

### API - Output

| Type   | Description                 |
| ------ | --------------------------- |
| String | String with things replaced |

## Examples

_Simple replace:_

- **Example replacement recipe in words** — replace all instances of `x` with `🦄`.

- **Solution using this library:**:

```js
const er = require("easy-replace");

er(
  "a x c x d",
  {
    leftOutsideNot: "",
    leftOutside: "",
    leftMaybe: "",
    searchFor: "x",
    rightMaybe: "",
    rightOutside: "",
    rightOutsideNot: ""
  },
  "🦄"
);
//=> 'a 🦄 c 🦄 d'
```

Case insensitive setting — set each and every key you want to ignore the case via `opts.i`:

```js
var er = require("easy-replace");

er(
  "a X c x d",
  {
    leftOutsideNot: "",
    leftOutside: "",
    leftMaybe: "",
    searchFor: "x",
    rightMaybe: "",
    rightOutside: "",
    rightOutsideNot: "",
    i: {
      searchFor: true
    }
  },
  "🦄"
);
//=> 'a 🦄 c 🦄 d'
```

---

**[⬆ back to top](#)**

### "Maybes" — optional surrounding strings to be replaced as well

- **Example replacement recipe in words** — Replace all instances of `i`. If there are `🐴` or `🦄` characters on the left, count them as part of found `i` and replace together as one thing. If there are `🐴` or `🦄` characters on the right, count them as part of found `i` and replace together as one thing.

- **Solution using this library:**:

```js
var er = require("easy-replace");

er(
  "🐴i🦄 🐴i i🦄 i",
  {
    leftOutsideNot: "",
    leftOutside: "",
    leftMaybe: ["🐴", "🦄"],
    searchFor: "i",
    rightMaybe: ["🐴", "🦄"],
    rightOutside: "",
    rightOutsideNot: ""
  },
  "x"
);
//=> 'x x x x'
```

By the way, notice, how the values can be strings or arrays! The `easy-replace` doesn't accept array only for `searchFor` values — create a loop from the outside of this library, then call this library many times if you want to search for multiple values.

Case-insensitive setting will cover more surroundings' cases:

```js
var er = require("easy-replace");

er(
  "Ai ib Aib i",
  {
    leftOutsideNot: "",
    leftOutside: "",
    leftMaybe: ["a", "z"],
    searchFor: "i",
    rightMaybe: ["y", "b"],
    rightOutside: "",
    rightOutsideNot: "",
    i: {
      leftMaybe: true
    }
  },
  "x"
);
//=> 'x x x x'
```

---

**[⬆ back to top](#)**

### Negative lookahead - if you want to match something _not followed_ by something else

- **Example replacement recipe in words** — Replace all instances of `🦄`, but only ones that don't have `c` or `d` on the right.

- **Solution using this library:**:

```js
var er = require("easy-replace");

er(
  "a🦄c x🦄x",
  {
    leftOutsideNot: "",
    leftOutside: "",
    leftMaybe: "",
    searchFor: "🦄",
    rightMaybe: "",
    rightOutside: "",
    rightOutsideNot: ["c", "d"]
  },
  "🐴"
);
//=> 'a🦄c x🐴x'
```

Case insensitive setting will narrow-down the amount of findings/replacements:

```js
var er = require("easy-replace");

er(
  "a🦄C x🦄x",
  {
    leftOutsideNot: "",
    leftOutside: "",
    leftMaybe: "",
    searchFor: "🦄",
    rightMaybe: "",
    rightOutside: "",
    rightOutsideNot: ["c", "d"],
    i: {
      rightOutsideNot: true
    }
  },
  "🐴"
);
//=> 'a🦄c x🐴x'
```

---

**[⬆ back to top](#)**

### Positive lookbehind - if you want to match something that is _preceded_ by something else

For example, search for space characters that have another space right to their left, and delete them

- **Example replacement recipe in words** — Replace all occurencies of space character, but only those that have another space character in front of them.

- **Solution using this library:**:

```js
var er = require("easy-replace");

er(
  "zzzzz  zzzzzz zzzzzz",
  {
    leftOutsideNot: "",
    leftOutside: " ", // <- space
    leftMaybe: "",
    searchFor: " ", // <- space
    rightMaybe: "",
    rightOutside: "",
    rightOutsideNot: ""
  },
  "" // <- empty string
);
//=> 'zzzzz zzzzzz zzzzzz'
```

---

**[⬆ back to top](#)**

### Negative lookbehind - if you want to match something that is NOT preceded by something else

For example, our `<br />` sometimes look like `<br/>`. Replace all occurencies of `/>` with `{{space character}}/>` (disregard curly braces, it's only to make it more visible here) if they are not preceded with space already:

- **Example replacement recipe in words** — Add missing spaces before closing slashes on tags. Do not add spaces where they exist already.

- **Solution using this library:**:

```js
var er = require("easy-replace");

er(
  "<br /><br/><br />",
  {
    leftOutsideNot: " ",
    leftOutside: "",
    leftMaybe: "",
    searchFor: "/>",
    rightMaybe: "",
    rightOutside: "",
    rightOutsideNot: ""
  },
  " />"
);
//=> '<br /><br /><br />'
```

---

**[⬆ back to top](#)**

### Real life scenario

- **Example replacement recipe in words** — Add a missing semicolon and/or ampersand on `&nbsp;`, but only where they are missing.

- **Solution using this library:**:

```js
var er = require("easy-replace");

er(
  "&nbsp; nbsp &nbsp nbsp;",
  {
    leftOutsideNot: "",
    leftOutside: "",
    leftMaybe: "&",
    searchFor: "nbsp",
    rightMaybe: ";",
    rightOutside: "",
    rightOutsideNot: ""
  },
  "&nbsp;"
);
//=> '&nbsp; &nbsp; &nbsp; &nbsp;'
```

If you want to cover cases of random letter capitalisation of `n`, `b`, `s` and `p`, just set case-insensitive flag for `searchFor`:

```js
var er = require("easy-replace");

er(
  "&nBsp; NBsp &nbSP NbsP;",
  {
    leftOutsideNot: "",
    leftOutside: "",
    leftMaybe: "&",
    searchFor: "nbsp",
    rightMaybe: ";",
    rightOutside: "",
    rightOutsideNot: "",
    i: {
      searchFor: true
    }
  },
  "&nbsp;"
);
//=> '&nbsp; &nbsp; &nbsp; &nbsp;'
```

**[⬆ back to top](#)**

## Rationale

Positive lookbehinds and negative lookbehinds are not supported in native JavaScript (at least in what we count as "classic" JavaScript, not ES2030 or something). If you gonna use a library for string replacement, better use one with "easy" in its name.

Did I mention that `easy-replace` is also [astral-character](https://mathiasbynens.be/notes/javascript-unicode)-friendly? As you noticed in the examples above, it accepts emoji perfectly fine (and AVA tests prove this).

It's also impossible to cause an infinite loop on this library (see tests 8.1-8.6).

`easy-replace` is also friendly if any input is of a `number` type — numbers are converted and replaced string is returned in `string` type (see test 10.8). That's an extra convenience.

Options object is fool-proof — you can omit keys or pass non-existing ones or pass non-string type variables — if the options key matches, it's first turned into string. You can even omit any or all of the inputs — library will return an empty string (see tests 9.1–9.6).

Same with replacment — empty, `null`, `boolean` or `undefined` are accepted and interpreted as a request to delete any results found. There's no replacement, only deletion in such case (see tests 10.1–10.7).

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=easy-replace%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aeasy-replace%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=easy-replace%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aeasy-replace%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=easy-replace%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aeasy-replace%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/easy-replace.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/easy-replace
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/easy-replace
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/easy-replace
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/easy-replace
[downloads-img]: https://img.shields.io/npm/dm/easy-replace.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/easy-replace
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/easy-replace
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
