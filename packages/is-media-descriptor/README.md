# is-media-descriptor

> Is given string a valid media descriptor (including media query)?

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
- [Background](#background)
- [API - Input](#api-input)
- [API - Output](#api-output)
- [Example](#example)
- [Competition](#competition)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i is-media-descriptor
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`isMediaD`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const isMediaD = require("is-media-descriptor");
```

or as an ES Module:

```js
import isMediaD from "is-media-descriptor";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/is-media-descriptor/dist/is-media-descriptor.umd.js"></script>
```

```js
// in which case you get a global variable "isMediaDescriptor" which you consume like this:
const isMediaD = isMediaDescriptor;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                              | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | --------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/is-media-descriptor.cjs.js` | 10 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/is-media-descriptor.esm.js` | 9 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/is-media-descriptor.umd.js` | 5 KB  |

**[⬆ back to top](#)**

## Background

We are talking about so-called _media descriptors_ ([older spec](https://www.w3.org/TR/html4/types.html#type-media-descriptors), [newer spec - CSS MQ Level 4, draft at the moment](https://drafts.csswg.org/mediaqueries/)).

This program checks _media descriptors_ — either in HTML attribute's `media` values OR in CSS styles, everything between `@media`/`@import` and opening curly brace.

For example,

The value `"screen"` below is a _media descriptor_ and this program checks it:

```xml
<style media="screen"></style>
              ^^^^^^
```

Or this `"print"`:

```xml
<link rel="stylesheet" type="text/css" href="print.css" media="print" />
                                                               ^^^^^
```

> "CSS adapted and extended this functionality with its @media and @import rules, adding the ability to query the value of individual features" — https://drafts.csswg.org/mediaqueries/

This program validates this `only screen and (min-width: 320px) and (max-width: 500px)` in CSS:

```css
@media only screen and (min-width: 320px) and (max-width: 500px) {
  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ media descriptor * {
    font-family: sans-serif;
  }
}
```

We plan to catch as many errors as possible:

- typos
- unclosed brackets
- redundant characters
- untangle the boolean logic
- ... anything that can happen to media queries and media selectors in general.

This is not a replacement for validator, this is a linting tool. We will use it in `EMLint` ([npm](https://www.npmjs.com/package/emlint)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/emlint/)).

**[⬆ back to top](#)**

## API - Input

**isMediaD(str, opts)** — in other words, a function which takes a string and options, a plain object.

| Input argument | Type         | Obligatory? | Description                                                                                           |
| -------------- | ------------ | ----------- | ----------------------------------------------------------------------------------------------------- |
| `str`          | String       | no          | The extracted value of HTML `media` attribute or CSS media query without `@media` or opening bracket. |
| `opts`         | Plain object | no          | Optional options go here.                                                                             |

For example, all the calls below will yield an empty array (no errors):

```js
isMediaD();
isMediaD("");
isMediaD("screen");
isMediaD("screen", {});
isMediaD("screen", null);
isMediaD("screen", { offset: 0 });
isMediaD("screen", { offset: 51 });
```

⚠️ A bad example is below - don't put `@media`, extract the value:

```js
// program won't work with `@media` - extract the value first!
isMediaD(
  "@media only (screen) and (min-width: 320px) and (max-width: 500px) {"
);
```

Correct input's example would be:

```js
isMediaD("only (screen) and (min-width: 320px) and (max-width: 500px)");
```

If an input is not a string or an empty string, an empty array will be returned.

**[⬆ back to top](#)**

### Options object

| `options` object's key | Type    | Obligatory? | Default | Description                                            |
| ---------------------- | ------- | ----------- | ------- | ------------------------------------------------------ |
| {                      |         |             |         |
| `offset`               | Integer | no          | `0`     | All reported indexes will be incremented by this much. |
| }                      |         |             |         |

Falsey `opt.offset` is fine but truthy non-integer will _throw_.

**[⬆ back to top](#)**

## API - Output

The program returns an array of zero or more plain objects, each meaning an error. Each object's notation is the same as in EMLint (except there's no `ruleId`):

```js
{
  idxFrom: 21,
  idxTo: 22,
  message: `Rogue bracket.`,
  fix: {
    ranges: [[21, 22]]
  }
}
```

Quick basics: `idxFrom` and `idxTo` are the same as in `String.slice`, just used for marking.

The `fix` key is either `null` or has value — plain object — with key `ranges`. ESLint uses singular, `range`, EMLint uses `ranges`, plural, because EMLint uses Ranges notation — where ESLint marks "to add" thing separately, EMLint puts it as the third element in ranges array.

Ranges as key above and in general are always either `null` or array of arrays.

EMLint and ranges arrays here follow Ranges notation and [all Ranges packages](https://gitlab.com/codsen/codsen#-range-libraries) can be used to process them — [merging](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-merge/), [inverting](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-invert/), [resolving/applying](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/) and so on.

**[⬆ back to top](#)**

## Example

```js
const isMediaD = require("is-media-descriptor");
const str = `screeen`;
const res = isMediaD(str);
console.log(JSON.stringify(res, null, 4));
// => [
//      {
//        idxFrom: 0,
//        idxTo: 7,
//        message: `Did you mean "screen"?`,
//        fix: {
//          ranges: [[0, 7]]
//        }
//      }
//    ]
```

The error objects match those of `EMLint` ([npm](https://www.npmjs.com/package/emlint)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/emlint/)), ranges value matches the [ranges](https://gitlab.com/codsen/codsen#-range-libraries) spec (in ranges index array, third array element means what to add; only two elements is deletion).

**[⬆ back to top](#)**

## Competition

There are capable CSS parsers out there, but they are all oriented at parsing the **correct code** and strictly pure HTML or CSS. Code validators built upon such parsers are not really serious validators.

- [W3C](http://jigsaw.w3.org/css-validator/#validate_by_input+with_options)
- [CSSTree Validator](https://csstree.github.io/docs/validator.html)

Think, if a tool catches errors, and those errors break parsers, and parser drives a tool, how capable is the tool?

It's similar to:

If a policemen catch thieves, and thieves pay the government each month to pay police wages, how capable is that police?

Parser is for correct code. For broken code or mixed sources, you need _Rambo_ tool, trained at dealing with bad guys. You need this program.

This program is aimed at **broken code processing**, to power linters, to find _and fix_ broken code, possibly at code-editor-level. It does not work from AST; it processes the input as string.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=is-media-descriptor%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ais-media-descriptor%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=is-media-descriptor%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ais-media-descriptor%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=is-media-descriptor%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ais-media-descriptor%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/is-media-descriptor.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/is-media-descriptor
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/is-media-descriptor
[cov-img]: https://img.shields.io/badge/coverage-87.34%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/is-media-descriptor
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/is-media-descriptor
[downloads-img]: https://img.shields.io/npm/dm/is-media-descriptor.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/is-media-descriptor
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/is-media-descriptor
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
