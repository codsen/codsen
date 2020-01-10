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
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/is-relative-uri.cjs.js` | 4 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/is-relative-uri.esm.js` | 3 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/is-relative-uri.umd.js` | 3 KB |

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

Falsey `opt.offset` is fine but truthy non-integer will _throw_.

**[⬆ back to top](#)**

## API - Output

Program returns a clone of a plain object similar to:

```js
{
  res: false,
  message: `Unrecognised language subtag, "posix".`
}
```

or if schema-URI's are flagged up via `opts.flagUpUrisWithSchemes`, message will be `null`:

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
const str = `screeen`;
const res = isRel(str);
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

## `opts.flagUpUrisWithSchemes`

When validating the URI's which can be relative (for example, `href` attribute values) one should use two libraries: one to check strict URI's (those with schema) and one with relative URI's (those without schema).

For example, [is-url-superb](https://www.npmjs.com/package/is-url-superb) and this package.

If `opts.flagUpUrisWithSchemes` is set to `true`, this program will proactively search and yield a falsey result.

Another challenge: URI with schema as error is not the same "error", it's not a "real error". To distinguish the two we'll set result object's key `message` to null.

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
[cov-img]: https://img.shields.io/badge/coverage-89.83%25-brightgreen.svg?style=flat-square
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
