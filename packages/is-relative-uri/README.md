# is-relative-uri

> Is given string a relative URI?

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![no dependencies][no-deps-img]][no-deps-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Background](#background)
- [Validating them all](#validating-them-all)
- [API - Input](#api-input)
- [API - Output](#api-output)
- [Example](#example)
- [`opts.flagUpUrisWithSchemes`](#optsflagupuriswithschemes)
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
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/is-relative-uri.cjs.js` | 9 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/is-relative-uri.esm.js` | 8 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/is-relative-uri.umd.js` | 7 KB |

**[⬆ back to top](#)**

## Background

For example, HTML attributes `href` have URI-type values.

This program validates, are URI's, specifically, _relative URI references_, typed correctly. It will not "go to the internet" to check is the actual asset online, it will only tell if you mistyped something.

If you consider "URI"-type attribute values in HTML, for example `href`, there two kinds of value types:

- those that start with _scheme_, `http` or `https` or `mailto` or whatever, and
- those that don't.

_Scheme_ like `https` is the "normal" way:

```xml
<a href="https://www.npmjs.com">z</a>
```

But no _scheme_, so called _relative URI's_ are fine too:

```xml
<a href="//example.com/path/resource.txt">z</a>
<a href="/path/resource.txt">z</a>
<a href="path/resource.txt">z</a>
<a href="/path/resource.txt">z</a>
<a href="../resource.txt">z</a>
<a href="./resource.txt">z</a>
<a href="resource.txt">z</a>
<a href="#fragment">z</a>
```

But spec-wise, at least theoretically, these are also fine (see [wikipedia](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#URI_references) for more).

Considering the base URI of `http://a/b/c/d;p?q`, the following URI's would get resolved accordingly:

```xml
<a href="g:h">z</a>     -> "g:h"
<a href="g">z</a>       -> "http://a/b/c/g"
<a href="./g">z</a>     -> "http://a/b/c/g"
<a href="g/">z</a>      -> "http://a/b/c/g/"
<a href="/g">z</a>      -> "http://a/g"
<a href="//g">z</a>     -> "http://g"
<a href="?y">z</a>      -> "http://a/b/c/d;p?y"
<a href="g?y">z</a>     -> "http://a/b/c/g?y"
<a href="#s">z</a>      -> "http://a/b/c/d;p?q#s"
<a href="g#s">z</a>     -> "http://a/b/c/g#s"
<a href="g?y#s">z</a>   -> "http://a/b/c/g?y#s"
<a href=";x">z</a>      -> "http://a/b/c/;x"
<a href="g;x">z</a>     -> "http://a/b/c/g;x"
<a href="g;x?y#s">z</a> -> "http://a/b/c/g;x?y#s"
<a href="">z</a>        -> "http://a/b/c/d;p?q"
<a href=".">z</a>       -> "http://a/b/c/"
<a href="./">z</a>      -> "http://a/b/c/"
<a href="..">z</a>      -> "http://a/b/"
<a href="../">z</a>     -> "http://a/b/"
<a href="../g">z</a>    -> "http://a/b/g"
<a href="../..">z</a>   -> "http://a/"
<a href="../../">z</a>  -> "http://a/"
<a href="../../g">z</a> -> "http://a/g"
```

**[⬆ back to top](#)**

## Validating them all

As you saw, relative URI's can be pretty much anything, including empty string and random letters like `zzz`.

What do we do?

The only thing left is to try to **catch bad patterns**.

Conceptually, this program tells **if a given string is not messed up** from the perspective of relative URI pattern, as far as our imperfect algorithm sees.

Mainly: no whitespace, no repeated things (tripple slashes or double question marks), no slashes or dots after a hash, two dots must not be followed by a letter and others.

**[⬆ back to top](#)**

## API - Input

**isRel(str, opts)** — in other words, a function which takes a string and options, a plain object.

| Input argument | Type         | Obligatory? | Description                                                                                           |
| -------------- | ------------ | ----------- | ----------------------------------------------------------------------------------------------------- |
| `str`          | String       | no          | The extracted value of HTML `media` attribute or CSS media query without `@media` or opening bracket. |
| `opts`         | Plain object | no          | Optional options go here.                                                                             |

If input is not a string, error will be thrown.

**[⬆ back to top](#)**

### Options object

| `options` object's key  | Type    | Obligatory? | Default | Description                                                            |
| ----------------------- | ------- | ----------- | ------- | ---------------------------------------------------------------------- |
| {                       |         |             |         |
| `flagUpUrisWithSchemes` | boolean | no          | `true`  | Should we yield `false` on URI's with scheme (`https://` for example)? |
| }                       |         |             |         |

**[⬆ back to top](#)**

## API - Output

Program returns a clone of a plain object similar to:

```js
{
  res: false,
  message: `Two consecutive hashes.`
}
```

or if schema-URI's are flagged up via `opts.flagUpUrisWithSchemes`, the `message` value can be `null`:

```js
{
  res: false,
  message: null
}
```

or

```js
{
  res: true,
  message: null
}
```

`res` is always boolean.

`message` is either string (error message) or `null`.

False `res` and `null` message happens only on schema-URI's. By checking is `message` set we distinguish were there real errors.

**[⬆ back to top](#)**

## Example

```js
const isRel = require("is-relative-uri");
const str = `.../resource.txt`;
const res = isRel(str);
console.log(JSON.stringify(res, null, 4));
// => {
//      res: false,
//      message: `Two consecutive hashes.`
//    }
```

**[⬆ back to top](#)**

## `opts.flagUpUrisWithSchemes`

When validating the URI's which can be relative (for example, `href` attribute values) one should use two libraries: one to check strict URI's (those with schema) and one with relative URI's (those without schema).

For example, [is-url-superb](https://www.npmjs.com/package/is-url-superb) and this package.

If `opts.flagUpUrisWithSchemes` is set to `true`, this program will search for schemes and yield a falsey result if it detects a known `<scheme>:` for example `mailto:`.

Another challenge: URI with schema-as-error is not the same "error" — it's not a "real error". To distinguish the two we'll set result object's key `message` to null.

That is, seemingly correct URI will have a message `null`:

```js
const isRel = require("is-relative-uri");
const str = `https://codsen.com`;
const res = isRel(str, { flagUpUrisWithSchemes: true });
console.log(JSON.stringify(res, null, 4));
// => {
//      res: false,
//      message: null
//    }
```

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

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/is-relative-uri
[cov-img]: https://img.shields.io/badge/coverage-93.1%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/is-relative-uri
[no-deps-img]: https://img.shields.io/badge/-no%20dependencies-brightgreen?style=flat-square
[no-deps-url]: https://www.npmjs.com/package/is-relative-uri?activeTab=dependencies
[downloads-img]: https://img.shields.io/npm/dm/is-relative-uri.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/is-relative-uri
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/is-relative-uri
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
