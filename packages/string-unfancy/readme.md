<h1 align="center">
  <img width="400" src="https://cdn.rawgit.com/codsen/string-unfancy/59e8cfc1/media/logo.png" alt="string-unfancy">
  <br>
</h1>

# string-unfancy

> Replace all fancy dashes, quotes etc with their simpler equivalents

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Table of Contents](#markdown-header-markdown-header-table-of-contents)
- [Install](#markdown-header-markdown-header-install)
- [Idea](#markdown-header-markdown-header-idea)
- [Usage](#markdown-header-markdown-header-usage)
- [API](#markdown-header-markdown-header-api)
- [Example - treating the image alt attributes - Gulp and stream-tapping](#markdown-header-markdown-header-example-treating-the-image-alt-attributes-gulp-and-stream-tapping)
- [Contributing](#markdown-header-markdown-header-contributing)
- [Licence](#markdown-header-markdown-header-licence)

## Install

```bash
npm i string-unfancy
```

> or, if you work with image `alt` attributes, check out [html-img-alt](https://bitbucket.org/codsen/html-img-alt) which uses `string-unfancy`.

```js
// consume via a CommonJS require:
const unfancy = require("string-unfancy");
// or as an ES Module:
import unfancy from "string-unfancy";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                         | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-unfancy.cjs.js` | 2 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-unfancy.esm.js` | 1 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-unfancy.umd.js` | 59 KB |

**[⬆ back to top](#)**

## Idea

This library converts fancy strings like curly apostrophes into not fancy ones, like a single quote. One could say it's the opposite of [Detergent](https://bitbucket.org/codsen/detergent).

`string-unfancy` main purpose is to simplify the images `alt` attribute content in email templates.

The list of covered characters includes all kinds of single quotes, double quotes, dashes and the non-breaking space.

Also, this library will recursively decode any HTML entities before performing the replacement.

PS. If you want a higher-level tool, [html-img-alt](https://bitbucket.org/codsen/html-img-alt) uses `string-unfancy` and performs many more fixes (adding empty `alt` attributes if they are missing, cleaning of the whitespace between the attributes, trimming of the `alt` contents and even replacing single quotes to double quotes).

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

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/string-unfancy/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/string-unfancy/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/string-unfancy.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-unfancy
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/string-unfancy
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/string-unfancy/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/string-unfancy?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-unfancy
[downloads-img]: https://img.shields.io/npm/dm/string-unfancy.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-unfancy
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-unfancy
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/string-unfancy
