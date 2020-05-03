# generate-atomic-css

> Generate Atomic CSS

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

Other siblings of this package:

- CLI for it: `generate-atomic-css-cli` [on npm](https://www.npmjs.com/package/generate-atomic-css-cli), [on GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/generate-atomic-css-cli)

## Table of Contents

- [Install](#install)
- [API](#api)
- [genAtomic() - input API](#genatomic-input-api)
- [genAtomic() - output API](#genatomic-output-api)
- [version](#version)
- [headsAndTails](#headsandtails)
- [extractFromToSource()](#extractfromtosource)
- [Idea](#idea)
- [Config](#config)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i generate-atomic-css
```
Consume via a `require()`:

```js
const { genAtomic, version, headsAndTails, extractFromToSource } = require("generate-atomic-css");
```

or as an ES Module:

```js
import { genAtomic, version, headsAndTails, extractFromToSource } from "generate-atomic-css";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/generate-atomic-css/dist/generate-atomic-css.umd.js"></script>
```

```js
// in which case you get a global variable "generateAtomicCss" which you consume like this:
const { genAtomic, version, headsAndTails, extractFromToSource } = generateAtomicCss;
```

This package has three builds in `dist/` folder:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/generate-atomic-css.cjs.js` | 25 KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/generate-atomic-css.esm.js` | 20 KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/generate-atomic-css.umd.js` | 22 KB

**[⬆ back to top](#)**

## API

Three methods are exported:

```js
const {
  genAtomic,
  version,
  headsAndTails,
  extractFromToSource,
} = require("generate-atomic-css");
// or
import {
  genAtomic,
  version,
  headsAndTails,
  extractFromToSource,
} from "generate-atomic-css";
```

| Name                | What it does                                                     |
| ------------------- | ---------------------------------------------------------------- |
| genAtomic           | It's the main function which generates CSS                       |
| version             | Exports version from package.json, for example, string `1.0.1`   |
| headsAndTails       | Exports a plain object with all heads and tails                  |
| extractFromToSource | Extracts "from" and "to" from source in rows, separated by pipes |

**[⬆ back to top](#)**

## genAtomic() - input API

It's a function, takes two arguments: input string and optional options object:

**genAtomic(str\[, originalOpts])**

For example:

```js
import {
  genAtomic,
  version,
  headsAndTails,
  extractFromToSource,
} from "generate-atomic-css";
const source = `a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10

.mt$$$ { margin-top: $$$px !important; } | 1
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */

tralala

/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z`;
const result = genAtomic(source, {
  includeConfig: false,
  includeHeadsAndTails: false,
});
console.log(`result:\n${result}`);
// => "a
//
// .pb5  { padding-bottom:  5px !important; }
// .pb6  { padding-bottom:  6px !important; }
// .pb7  { padding-bottom:  7px !important; }
// .pb8  { padding-bottom:  8px !important; }
// .pb9  { padding-bottom:  9px !important; }
// .pb10 { padding-bottom: 10px !important; }
//
// .mt0 { margin-top:   0 !important; }
// .mt1 { margin-top: 1px !important; }
//
// z
// "
```

**[⬆ back to top](#)**

### genAtomic() - Optional Options Object

It's a plain object which goes into second input argument of the main function, `genAtomic()`.
Here are all the keys and their values:

| Options Object's key     | The type of its value    | Default | Description                                                                                                                                                                                      |
| ------------------------ | ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| {                        |                          |         |
| `includeConfig`          | boolean                  | `true`  | Should config be repeated, wraped with `GENERATE-ATOMIC-CSS-CONFIG-STARTS` and `GENERATE-ATOMIC-CSS-CONFIG-ENDS`? Enabling this enables `includeHeadsAndTails` as well (if not enabled already). |
| `includeHeadsAndTails`   | boolean                  | `true`  | Should the generated CSS be wrapped with `GENERATE-ATOMIC-CSS-CONFIG-STARTS` and `GENERATE-ATOMIC-CSS-CONFIG-ENDS`?                                                                              |
| `pad`                    | boolean                  | `true`  | Should the numbers be padded                                                                                                                                                                     |
| `configOverride`         | `null` (off) or `string` | `null`  | This is override, you can hard-set the config from outside. Handy when input contains old/wrong config.                                                                                          |
| `reportProgressFunc`     | function or null         | `null`  | Handy in worker setups, if you provide a function, it will be called for each percentage done from `reportProgressFuncFrom` to `reportProgressFuncTo`, then finally, with the result.            |
| `reportProgressFuncFrom` | natural number           | `0`     | `reportProgressFunc()` will ping unique percentage progress once per each percent, from 0 to 100 (%). You can skew the starting percentage so counting starts not from zero but from this.       |
| `reportProgressFuncTo`   | natural number           | `100`   | `reportProgressFunc()` will ping unique percentage progress once per each percent, from 0 to 100 (%). You can skew the starting percentage so counting starts not from zero but from this.       |
| }                        |                          |         |

Here it is, in one place, in case you want to copy-paste it somewhere:

```js
{
  includeConfig: true,
  includeHeadsAndTails: true,
  pad: true,
  configOverride: null,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};
```

**[⬆ back to top](#)**

## genAtomic() - output API

The main function genAtomic() exports a plain object where result string is under key `result`:

For example, here's the format of the main function's output:

```js
{
  log: {
    count: 1000
  },
  result: "<bunch of generated CSS>"
}
```

You tap the result like this:

```js
import {
  genAtomic,
  version,
  headsAndTails,
  extractFromToSource,
} from "generate-atomic-css";
const source = `.mt$$$ { margin-top: $$$px; }|3`;
const { log, result } = genAtomic(source, {
  includeConfig: true,
});
console.log(`total generated classes and id's: ${log.count}`);
// => 4
console.log(`result:\n${result}`);
// => <bunch of generated CSS>
```

**[⬆ back to top](#)**

## version

It's a string and it comes straight from `package.json`. For example:

```js
import {
  genAtomic,
  version,
  headsAndTails,
  extractFromToSource,
} from "generate-atomic-css";
console.log(`version = v${version}`);
// => version = v1.0.1
```

**[⬆ back to top](#)**

## headsAndTails

It's a plain object, its main purpose is to serve as a single source of truth for heads and tails names:

```js
{
  CONFIGHEAD: "GENERATE-ATOMIC-CSS-CONFIG-STARTS",
  CONFIGTAIL: "GENERATE-ATOMIC-CSS-CONFIG-ENDS",
  CONTENTHEAD: "GENERATE-ATOMIC-CSS-CONTENT-STARTS",
  CONTENTTAIL: "GENERATE-ATOMIC-CSS-CONTENT-ENDS"
}
```

For example,

```js
import {
  genAtomic,
  version,
  headsAndTails,
  extractFromToSource,
} from "generate-atomic-css";
console.log(`headsAndTails.CONTENTTAIL = ${headsAndTails.CONTENTTAIL}`);
// => headsAndTails.CONTENTTAIL = GENERATE-ATOMIC-CSS-CONTENT-ENDS
```

**[⬆ back to top](#)**

## extractFromToSource()

It's an internal function which reads the source line, for example:

```js
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10
```

and separates "from" (`5` above) and "to" (`10` above) values from the rest of the string (`.pb$$$ { padding-bottom: $$$px !important; }`).

The challenging part is that pipes can be wrapping the line from outside, plus, if there is only one number at the end of the line, it is "to" value.

```
| .mt$$$ { margin-top: $$$px !important; } | 1 |
```

Here's an example how to use `extractFromToSource()`:

```js
const {
  genAtomic,
  version,
  headsAndTails,
  extractFromToSource,
} = require("generate-atomic-css");
const input1 = `.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10`;
const input2 = `.mt$$$ { margin-top: $$$px !important; } | 1`;

// second and third input argument are default "from" and default "to" values:
const [from1, to1, source1] = extractFromToSource(input1, 0, 500);
console.log(`from = ${from1}`);
// from = 5
console.log(`to = ${to1}`);
// from = 10
console.log(`source = "${source1}"`);
// source = ".pb$$$ { padding-bottom: $$$px !important; }"

const [from2, to2, source2] = extractFromToSource(input2, 0, 100);
console.log(`from = ${from2}`);
// from = 0 <--- default
console.log(`to = ${to2}`);
// from = 1 <--- comes from pipe, "} | 1`;"
console.log(`source = "${source2}"`);
// source = ".mt$$$ { margin-top: $$$px !important; }"
```

**[⬆ back to top](#)**

## Idea

On a basic level, you can turn off heads/tails (set `opts.includeHeadsAndTails` to `false`) and config (set `opts.includeConfig` to `false`).

Each line which contains `$$$` will be repeated, from default `0` to `500` or within the range you set:

```css
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10
```

Above instruction means generate from `5` to `10`, inclusive:

```css
.pb5 {
  padding-bottom: 5px !important;
}
.pb6 {
  padding-bottom: 6px !important;
}
.pb7 {
  padding-bottom: 7px !important;
}
.pb8 {
  padding-bottom: 8px !important;
}
.pb9 {
  padding-bottom: 9px !important;
}
.pb10 {
  padding-bottom: 10px !important;
}
```

If you're happy to start from zero, you can put only one argument, "to" value:

```css
.w$$$p { width: $$$% !important; } | 100
```

Above instruction means generate from (default) `0` to (custom) `100`, inclusive:

```css
/* GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.w0p {
  width: 0 !important;
}
.w1p {
  width: 1% !important;
}
.w2p {
  width: 2% !important;
}
.... .w98p {
  width: 98% !important;
}
.w99p {
  width: 99% !important;
}
.w100p {
  width: 100% !important;
}
```

**[⬆ back to top](#)**

## Config

What happens if you want to edit the generated list, to change ranges, to add or remove rules?

You need to recreate the original "recipe", lines `.pb$$$ { padding-bottom: $$$px !important; }` and so on.

Here's where the config comes to help.

Observe:

```css
/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10

.mt$$$ { margin-top: $$$px !important; } | 1
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb5 {
  padding-bottom: 5px !important;
}
.pb6 {
  padding-bottom: 6px !important;
}
.pb7 {
  padding-bottom: 7px !important;
}
.pb8 {
  padding-bottom: 8px !important;
}
.pb9 {
  padding-bottom: 9px !important;
}
.pb10 {
  padding-bottom: 10px !important;
}

.mt0 {
  margin-top: 0 !important;
}
.mt1 {
  margin-top: 1px !important;
}
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */
```

If `opts.includeConfig` setting is on (it's on by default), your original config will be placed on top of generated content.

Furthermore, if generator detects content heads and tails placeholders, it will wipe existing contents there, replacing them with newly generated CSS.

The idea is you should be able to keep your config in your master email template, only remove config like regular CSS comment when deploying to production. But you'd still keep the master template with config. Later you could reuse it.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=generate-atomic-css%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Agenerate-atomic-css%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=generate-atomic-css%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Agenerate-atomic-css%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=generate-atomic-css%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Agenerate-atomic-css%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/generate-atomic-css
[cov-img]: https://img.shields.io/badge/coverage-94.72%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/generate-atomic-css
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/generate-atomic-css
[downloads-img]: https://img.shields.io/npm/dm/generate-atomic-css.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/generate-atomic-css
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/generate-atomic-css
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
