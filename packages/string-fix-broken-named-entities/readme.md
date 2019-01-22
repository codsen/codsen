# string-fix-broken-named-entities

> Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#markdown-header-install)
- [Idea](#markdown-header-idea)
- [Usage](#markdown-header-usage)
- [API - Input](#markdown-header-api-input)
- [API - Output](#markdown-header-api-output)
- [`opts.decode`](#markdown-header-optsdecode)
- [Tips](#markdown-header-tips)
- [Why not regexes?](#markdown-header-why-not-regexes)
- [Practical use](#markdown-header-practical-use)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i string-fix-broken-named-entities
```

```js
// consume via a require():
const fix = require("string-fix-broken-named-entities");
// or as a ES Module:
import fix from "string-fix-broken-named-entities";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                           | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-fix-broken-named-entities.cjs.js` | 11 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-fix-broken-named-entities.esm.js` | 11 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-fix-broken-named-entities.umd.js` | 34 KB |

**[⬆ back to top](#markdown-header-string-fix-broken-named-entities)**

## Idea

Detects and proposes fixes for a string that contains broken named HTML entities (for example, `&nnbsp;` with repeated "n"). The result is not a string but a `null` (nothing to fix) or an array of [ranges](https://bitbucket.org/account/user/codsen/projects/RNG) of index arrays with a value to replace. For example, `[[0, 6, "&nbsp;"]]` means replace from index `0` to `6` putting `&nbsp;`. Notice it's array of arrays because each range is an array and there can be few.

For example:

```js
console.log(JSON.stringify(fix("aaa&nnnbbssssp.ppp"), null, 4));
// => [[3, 14, "&nbsp;"]]

console.log(JSON.stringify(fix("a&amp;nbsp;b"), null, 4));
// => [[1, 11, "&nbsp;"]]

console.log(JSON.stringify(fix("a&bnsp;b&nsbp;c&nspb;"), null, 4));
// => [[1, 7, "&nbsp;"], [8, 14, "&nbsp;"], [15, 21, "&nbsp;"]]
```

**[⬆ back to top](#markdown-header-string-fix-broken-named-entities)**

## Usage

Normally the workflow goes like this. First, you tap the `ranges-push` to get the ranges manager and `ranges-apply` to "apply" ranges onto a string later.

Now, this library produces either ranges array or `null`. Latter is deliberate so that it is _falsey_. An empty array would have been _truthy_ and more clumsy to check. Either way, ranges manager, the JS Class, recognises `null` being pushed and skips it, so you can safely push the output of this library into ranges array:

```js
import Ranges from "ranges-push"; // you get a JS class
import rangesApply from "ranges-apply"; // you get a JS class
let rangesToDelete = new Ranges(); // create a new container
import fix from "string-fix-broken-named-entities"; // import this library :)

// define some broken HTML:
const brokenStr = "x &nbbbsp; y";

// push output (if any) straight to our ranges container:
rangesToDelete.push(fix(brokenStr));
// PS. The .push() above is custom method, not a Array.push(). It's named the same way because it's familiar and acts the same way. There is array underneath the Class actually, its helper functions are doing all the cleaning/sorting when values are pushed into a real, internal array.

// to retrieve the current state of ranges class, use .current() method:
// see full API at https://bitbucket.org/codsen/codsen/src/master/packages/ranges-push/
console.log(
  "current rangesToDelete.current() = " +
    JSON.stringify(rangesToDelete.current(), null, 4)
);
// => current rangesToDelete.current() = [[2, 10, "&nbsp;"]]

// let's "apply" the ranges and produce a clean string:
const resultStr = rangesApply(brokenStr, rangesToDelete.current());
console.log(`resultStr = "${resultStr}"`);
// => resultStr = "x &nbsp; y"
```

**[⬆ back to top](#markdown-header-string-fix-broken-named-entities)**

## API - Input

| Input argument | Type         | Obligatory? | Description                                               |
| -------------- | ------------ | ----------- | --------------------------------------------------------- |
| `str`          | String       | yes         | Input string                                              |
| `opts`         | Plain object | no          | Pass the Optional Options Object here, as second argument |

**[⬆ back to top](#markdown-header-string-fix-broken-named-entities)**

### Optional Options Object

| Options Object's key | The type of its value | Default | Description                                         |
| -------------------- | --------------------- | ------- | --------------------------------------------------- |
| {                    |                       |         |
| `decode`             | Boolean               | `false` | Whatever is fixed, will be written in decoded form. |
| }                    |                       |         |

**[⬆ back to top](#markdown-header-string-fix-broken-named-entities)**

## API - Output

**Output**: array or arrays (_ranges_) OR `null`

## `opts.decode`

If you set `opts.decode` and there are healthy encoded entities, those will not be decoded. Only if there are broken entities, those will be set in ranges as decoded values. If you want full decoding, consider filter the input with [normal decoding library](https://www.npmjs.com/package/ranges-ent-decode) right after filtering using this library.

For example, you'd first filter the string using this library, `string-fix-broken-named-entities`. Then you'd filter the same input skipping already recorded ranges, using [ranges-ent-decode](https://www.npmjs.com/package/ranges-ent-decode). Then you'd merge the ranges.

**[⬆ back to top](#markdown-header-string-fix-broken-named-entities)**

## Tips

You can save time and improve the workflow by making use of other range- class libraries:

- [ranges-push](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-push) manages ranges: sorts and merges them. Instead of pushing into an array, you push into a Class which performs all cleaning. You can fetch the current contents using `.current()` method.
- [ranges-apply](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-apply) applies ranges onto a string, producing a result string: ranges without third element mean deletion, ranges with the third element mean replacement. That library does all those deletions/replacements according to a given ranges array.

There are [other libraries](https://bitbucket.org/account/user/codsen/projects/RNG) for [cropping](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-crop), [sorting](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-sort), [merging](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-merge), performing regex-to-range [searches](https://bitbucket.org/codsen/codsen/src/master/packages/ranges-regex) and others.

**[⬆ back to top](#markdown-header-string-fix-broken-named-entities)**

## Why not regexes?

If you think about it, each regex will perform a search on a string. That's one full traversal of all indexes in a string. No matter how well it's optimised by the Node or browser, it is going to happen. Now, this library traverses the input string **only once** and registers all errors. You can't do that easily with regexes - the resulting regex would get unwieldy and hard to debug.

Furthermore, the rules in this library's algorithm are too complex for regexes, we use an equivalent of lookarounds and heavily rely on surroundings of a particular character we're evaluating. For example, here's how we detect the ending of a confirmed broken nbsp:

- we have detected its beginning (with the ampersand or "n" or "b" or "s" or "p" characters in case ampersand was missing)
- characters in the "chunk" comprise of at least three types of: `["n", "b", "s", "p"]`
- the chunk includes a semicolon, or one is missing and
- current character is not a semicolon
- the character that follows either does not exist (EOL) or is not a semicolon (to catch extra characters between nbsp and semicolon)
- the ending letter is either: a) outside of a string loop (we traverse string length + 1 to complete all clauses) OR b) one of 2 cases: 1) all letters of a set "n", "b", "s" and "p" have been matched at least once and ending letter is not equal to the one before (no repetition in the ending) OR ending letter is not any of a set: "n", "b", "s" and "p" (case insensitive).

Good luck putting the above in a regex and later troubleshooting it, after a few months.

**[⬆ back to top](#markdown-header-string-fix-broken-named-entities)**

## Practical use

This library was initially part of [Detergent.js](https://bitbucket.org/codsen/codsen/src/master/packages/detergent) and was taken out, rewritten; its unit tests were beefed up and consolidated and appropriately organised. Almost any tool that deals with HTML can make use of this library, especially, since it **only reports what was done** (instead of returning a mutated string which is up to you to compare and see what was done). It's easy to catch false positives this way.

**[⬆ back to top](#markdown-header-string-fix-broken-named-entities)**

## Contributing

- If you see an error, [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=string-fix-broken-named-entities%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=string-fix-broken-named-entities%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=string-fix-broken-named-entities%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://bitbucket.org/codsen/codsen/src/) via BitBucket, then write code, then file a pull request via BitBucket. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#markdown-header-string-fix-broken-named-entities)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/string-fix-broken-named-entities.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-fix-broken-named-entities
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/codsen/src/master/packages/string-fix-broken-named-entities
[cov-img]: https://img.shields.io/badge/coverage-90.73%25-brightgreen.svg?style=flat-square
[cov-url]: https://bitbucket.org/codsen/codsen/src/master/packages/string-fix-broken-named-entities
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-fix-broken-named-entities
[downloads-img]: https://img.shields.io/npm/dm/string-fix-broken-named-entities.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-fix-broken-named-entities
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-fix-broken-named-entities
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/codsen/src/master/LICENSE
