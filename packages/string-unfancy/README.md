![](https://glcdn.githack.com/codsen/codsen/raw/master/packages/string-unfancy/media/logo.png)

# string-unfancy

> Replace all fancy dashes, quotes etc with their simpler equivalents

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
- [Usage](#usage)
- [API](#api)
- [Example - treating the image alt attributes - Gulp and stream-tapping](#example-treating-the-image-alt-attributes---gulp-and-stream-tapping)
- [Can we use `lodash.deburr` instead?](#can-we-use-lodashdeburr-instead)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-unfancy
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`unfancy`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const unfancy = require("string-unfancy");
```

or as an ES Module:

```js
import unfancy from "string-unfancy";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-unfancy/dist/string-unfancy.umd.js"></script>
```

```js
// in which case you get a global variable "stringUnfancy" which you consume like this:
const unfancy = stringUnfancy;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                         | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-unfancy.cjs.js` | 2 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-unfancy.esm.js` | 1 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-unfancy.umd.js` | 75 KB |

**[⬆ back to top](#)**

## Idea

This library converts fancy strings like curly apostrophes into not fancy ones, like a single quote. One could say it's the opposite of [Detergent](https://gitlab.com/codsen/codsen/tree/master/packages/detergent).

`string-unfancy` main purpose is to simplify the images `alt` attribute content in email templates.

The list of covered characters includes all kinds of single quotes, double quotes, dashes and the non-breaking space.

Also, this library will recursively decode any HTML entities before performing the replacement.

PS. If you want a higher-level tool, [html-img-alt](https://gitlab.com/codsen/codsen/tree/master/packages/html-img-alt) uses `string-unfancy` and performs many more fixes (adding empty `alt` attributes if they are missing, cleaning of the whitespace between the attributes, trimming of the `alt` contents and even replacing single quotes to double quotes).

**[⬆ back to top](#)**

## Usage

```js
const unfancy = require("string-unfancy");
const res = unfancy("someone’s");
console.log("res = " + JSON.stringify(res1, null, 4));
// => "someone's"

// works with encoded HTML:
const res2 = unfancy("someone&rsquo;s");
console.log("res2 = " + JSON.stringify(res2, null, 4));
// => "someone's"
```

**[⬆ back to top](#)**

## API

API is simple: `string` in, `string` out.

Caveat: if the input is not a `string` it will `throw`.

## Example - treating the image alt attributes - Gulp and stream-tapping

If you are using Gulp to build email templates, you can `tap` the stream, apply a function to it, then within that function, [replace](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/replace) all instances of `alt="..."` with their unfancied versions.

First, you need to `require` [gulp-tap](https://www.npmjs.com/package/gulp-tap) and [string-unfancy](https://www.npmjs.com/package/string-unfancy):

```js
const tap = require("gulp-tap");
const unfancy = require("string-unfancy");
```

Then, tap your main build task's stream, probably towards the end of the pipeline:

```js
...
.pipe(tap((file) => {
  file.contents = Buffer.from(unfancy(file.contents.toString()))
}))
.pipe(gulp.dest('dist')) // that's the final write happening, yours might be different
...
```

Then, declare a function somewhere within your `gulpfile.js`:

```js
function unfancy(input) {
  input = input.replace(/alt="[^"]*"/g, el => {
    return unfancy(el);
  });
  return input;
}
```

As you see above, we're running an [inline function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/replace) upon all regex-matched characters.

And that's it! All image `alt` attributes will lose their HTML encoding and will have their fancy special characters converted to simple ASCII letter equivalents.

**[⬆ back to top](#)**

## Can we use `lodash.deburr` instead?

No. It [won't even convert](https://runkit.com/embed/2oy0v80zzfsw) a single m-dash! It's a different tool for a different purpose.

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-unfancy%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-unfancy%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-unfancy%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-unfancy%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-unfancy%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-unfancy%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/string-unfancy.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-unfancy
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-unfancy
[cov-img]: https://img.shields.io/badge/coverage-90.91%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-unfancy
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-unfancy
[downloads-img]: https://img.shields.io/npm/dm/string-unfancy.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-unfancy
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-unfancy
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
