# is-relative-uri

> Is given string a relative URI?

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
- [Variations](#variations)
- [API - Input](#api-input)
- [API - Output](#api-output)
- [Example](#example)
- [Competition](#competition)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i is-relative-uri
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`isRel`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const isRel = require("is-relative-uri");
```

or as an ES Module:

```js
import isRel from "is-relative-uri";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/is-relative-uri/dist/is-relative-uri.umd.js"></script>
```

```js
// in which case you get a global variable "isRelativeUri" which you consume like this:
const isRel = isRelativeUri;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                          | Size |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------- | ---- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/is-relative-uri.cjs.js` | 3 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/is-relative-uri.esm.js` | 3 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/is-relative-uri.umd.js` | 2 KB |

**[⬆ back to top](#)**

## Background

If you consider "URI"-type attribute values in HTML, for example `href`, there two kinds of value types, those that start with _scheme_, `http` or `https` or `mailto` or whatever and those that don't.

_Scheme_ `https`:

```html
<a href="https://www.npmjs.com"></a>
```

åNo _scheme_:

```html
<a href="index.html"></a>
```

Now, strictly speaking, values with _scheme_ like `https://www.npmjs.com` are called "URI"s. In practice, "URI" and "URL" is used interchangeably and there are plenty of packages on npm which validate, is it (in strict terms) URI, or not.

Strictly speaking "`index.html`" is not a URI — it's _a URI reference_ or _relative (URI) reference_ [source](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#URI_references).

There are no packages on npm that validate relative URI's and this package will do it.

**[⬆ back to top](#)**

## Variations

As per Wikipedia's [example](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#URI_references), all the following are correct relative URI references:

```html
//example.com/path/resource.txt /path/resource.txt path/resource.txt
/path/resource.txt ../resource.txt ./resource.txt resource.txt #fragment
```

This package will return `true` for all above. Now, to give you some `false` examples:

```html
///example.com/path/resource.txt (starts with three slashes) /path// (ends with
more than one slash) path/resource..txt (two or more consecutive dots)
.path/resource.txt (dot-letter) .../resource.txt (three dots) .//resource.txt
(dot-two or more slashes) resource .txt (whitespace anywhere) ##fragment (more
than one consecutive hash)
```

This package will be used in `emlint` ([npm](https://www.npmjs.com/package/emlint)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/emlint/)) to validate the values of all attributes which have URI-type values.

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

Bad examples - don't put `@media`, extract the value:

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

If an input is not a string or an empty string, an empty array will be returned. API is deliberately very _docile_ because it will be used exclusively inside other programs.

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

The `fix` key is either `null` or has value, plain object, with key `ranges`. ESLint uses singular, `range`, EMLint uses `ranges`, plural, because EMLint uses Ranges notation — where ESLint marks "to add" thing separately, EMLint puts it as the third element in ranges array.

Ranges as key above and in general are always either `null` or array of arrays.

EMLint and ranges arrays here follow Ranges notation and [all Ranges packages](https://gitlab.com/codsen/codsen#-range-libraries) can be used to process them — [merging](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-merge/), [inverting](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-invert/), [resolving/applying](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/) and so on.

**[⬆ back to top](#)**

## Example

```js
const isMediaD = require("is-relative-uri");
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

There are capable CSS parsers out there, but they are all oriented at parsing the **correct code**. If code errors are serious-enough, parsers will indeed throw certain errors but

a) those errors don't suggest how to fix the code;<br>
b) those errors often miss the exact location;<br>
c) most of the times they mention a _consequence_, not _cause_;<br>
d) often they lean on the safe side, passing similar values as legit and raise warnings for what is an error (for example, `mi-width`).

For example, https://csstree.github.io/docs/validator.html currently can't catch redundant bracket around `screen` yet http://jigsaw.w3.org/css-validator/#validate_by_input+with_options flags it up:

```css
@media only (screen) and (min-width: 320px) and (max-width: 500px) {
  .container {
    width: 100%;
  }
  nav {
    display: none;
  }
}
```

In general, CSS parsers are aimed at **correct code processing**.

And validators which are built upon such parsers are not really serious validators.

Conceptually, if a tool catches errors, and those errors break parsers, how can a tool be based upon a parser?

This program is aimed at **broken code processing**, to power linters, to find _and fix_ broken code, possibly at code-editor-level. It does not work from AST, it processes input as string.

Another problem is that parsers either parse either HTML or CSS. But media descriptor value (`"screen"`) can be both in HTML and in CSS:

```html
<style media="screen"></style>
```

```css
@media screen {
}
```

This program is agnostic, as long as you pass the "cropped" value (like `screen` above).

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=is-relative-uri%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ais-relative-uri%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=is-relative-uri%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ais-relative-uri%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=is-relative-uri%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ais-relative-uri%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/is-relative-uri.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/is-relative-uri
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/is-relative-uri
[cov-img]: https://img.shields.io/badge/coverage-90.2%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/is-relative-uri
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/is-relative-uri
[downloads-img]: https://img.shields.io/npm/dm/is-relative-uri.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/is-relative-uri
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/is-relative-uri
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
