# ranges-ent-decode

> Decode HTML entities recursively, get string index ranges of what needs to be replaced where

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Install

```bash
npm i ranges-ent-decode
```
The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`decode`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const decode = require("ranges-ent-decode");
```

or as an ES Module:

```js
import decode from "ranges-ent-decode";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ranges-ent-decode/dist/ranges-ent-decode.umd.js"></script>
```

```js
// in which case you get a global variable "rangesEntDecode" which you consume like this:
const decode = rangesEntDecode;
```

This package has three builds in `dist/` folder:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/ranges-ent-decode.cjs.js` | 5 KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/ranges-ent-decode.esm.js` | 3 KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/ranges-ent-decode.umd.js` | 80 KB

**[⬆ back to top](#)**

## Table of Contents

- [Install](#install)
- [TL;DR](#tldr)
- [Purpose](#purpose)
- [API](#api)
- [More on the algorithm](#more-on-the-algorithm)
- [Where's encode?](#wheres-encode)
- [Contributing](#contributing)
- [Licence](#licence)

## TL;DR

This is adapted version of [he.js](https://github.com/mathiasbynens/he) `decode()` with two differences:

1. the result is _array of ranges_ (not a string) and
2. it's decoding _recursively_.

All [he.js](https://github.com/mathiasbynens/he) unit tests were ported as well and do pass.

**[⬆ back to top](#)**

## Purpose

There are good and trusted [libraries](https://www.npmjs.com/package/he) that decode HTML entities, for example, `&pound;` into `£` (and backwards). However, their API's are **string-in, string-out**. And that's fine when doing small-scale operations or when there's no need to track the exact actions performed on a string.

If you made more complex tools (like [Detergent](https://www.npmjs.com/package/detergent) or [string-strip-html](https://www.npmjs.com/package/string-strip-html)), you would soon notice that mutating the input string many times over and over is bad. For example, HTML entity decoding would be one of the string mutations.

**First**, when many string mutations happen in a sequence, it's difficult to track the mutations when debugging. Questions like "at which step did this character got lost?" are common.

**Second**, string mutations are not very performant. As you know, in JS strings are [immutable](https://stackoverflow.com/a/51652749/3943954), which means each value change is a full new string written in the memory. Now, do it many times on a large string (your HTML source, typical "material" that string operation libraries intend to process), and you'll see some performance drops.

**Third**, what if an operation, somewhere in the middle of the pipeline needs to reference **the original string**, not the given mutated copy? Tough luck if an algorithm is mutating over-and-over – the character at index you seek might not there any more, it might be shifted somewhere! It's a rare case but has happened to me once. Completely contrived example, but imagine you delete spaces and decode entities. Now, some entities are unclosed, and spaces act as termination signs. However, because of some reason, you can't decode first, then delete spaces! It's a silly example, but it's these cases that become impossible to solve in the algorithms that are based on sequential mutation.

---

**The answer to that** is the _ranges_ approach. _A range_ is merely a way to note the string index ranges, exactly as `String.slice()`'s first two arguments do, just putting them into an array. If we add the third element in, "what to add" value, we get a universal notation, for example:

```js
const ranges = [
  [1, 2, "add this"],
  [3, 5], // <---- will just remove the slice from 3rd to 5th index
];
```

This library recursively decodes HTML entities and returns _ranges_. It does not change the string, it just tells you _what exactly_ should be changed and _where_.

**[⬆ back to top](#)**

## API

Input: string and Optional Options Object.
Output: an array of zero or more range arrays.

### API - Input

| Input argument | Key value's type | Obligatory? | Description                                        |
| -------------- | ---------------- | ----------- | -------------------------------------------------- |
| `input`        | String           | yes         | Text you want to strip HTML tags from              |
| `opts`         | Plain object     | no          | The Optional Options Object, see below for its API |

If any input arguments supplied are in any other types, an error will be `throw`n.

**[⬆ back to top](#)**

### Optional Options Object

The Optional Options Object completely matches the [he.js](https://github.com/mathiasbynens/he) options as of `v.1.1.1`, latest at 2018-08-21:

| An Optional Options Object's key | Type of its value | Default | Description                                                                                                                                                                                                           |
| -------------------------------- | ----------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                                |                   |         |
| `isAttributeValue`               | Boolean           | `false` | If on, entities will be decoded as if they were in attribute values. If off (default), entities will be decoded as if they were in HTML text. Read more [here](https://github.com/mathiasbynens/he#isattributevalue). |
| `strict`                         | Boolean           | `false` | If on, entities that can cause parsing errors will cause `throw`s. Read more [here](https://github.com/mathiasbynens/he#strict-1).                                                                                    |
| }                                |                   |         |

Here is the Optional Options Object in one place (in case you ever want to copy it whole):

```js
{
  isAttributeValue: false,
  strict: false
}
```

**[⬆ back to top](#)**

### API - Output

An array of zero or more ranges (arrays) is returned.

For example: `[[2, 17, "&"], [20, 34, "&"]]`. Or empty (nothing to decode): `[]`.

In each range array, the first argument means "from" string index, the second means "up to" index.
The third argument, if present, means what to add. If absent, it means it's deletion of that string index range.

**[⬆ back to top](#)**

## More on the algorithm

The biggest pain to code and the main [USP](https://en.wikipedia.org/wiki/Unique_selling_proposition) of this library is **being able to recursively decode and give the result as ranges**.

By _recursively_, we mean, the input string is decoded over and over until there's no difference in the result between previous and last decoding. Practically, this means we can tackle the unlikely, but possible cases of double and triple encoded strings, for example, this is a double-encoded string: `&amp;mdash;`. The original m-dash was turned into `&mdash;` on the first encoding round; then during second round its ampersand got turned into `&amp;` which lead to `&amp;mdash;`.

By _ranges_ we mean, the result is not a decoded string, but _instructions_ — what to change in that string in order for the string to be _decoded_. Practically, this means, we decode and don't lose the original character indexes. In turn, this means, we can gather more "instructions" (ranges) and join them later.

**[⬆ back to top](#)**

## Where's encode?

If you wonder, where's `encode()` _in ranges_, we don't need it! When you traverse the string and gather ranges, you can pass each ~code point~ grapheme (where emoji of length six should be counted "one") through `he.js` encode, compare "before" and "after" and if the two are different, create a new range for it.

The `decode()` is not that simple because the input string has to be processed, you can't iterate grapheme-by-grapheme (or character-by-character, if you don't care about Unicode's astral characters).

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-ent-decode%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-ent-decode%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-ent-decode%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-ent-decode%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=ranges-ent-decode%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aranges-ent-decode%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors


Some tests and some regexes adapted from he.js
MIT Licence - Copyright © 2013-2018 Mathias Bynens <https://mathiasbynens.be/>
https://github.com/mathiasbynens/he

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-ent-decode
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-ent-decode
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-ent-decode
[downloads-img]: https://img.shields.io/npm/dm/ranges-ent-decode.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-ent-decode
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-ent-decode
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
