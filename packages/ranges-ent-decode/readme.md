# ranges-ent-decode

> Decode HTML entities recursively, get string index ranges of what needs to be replaced where

[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Install

```sh
npm i ranges-ent-decode
```

```js
// consume as a CommonJS require:
const decode = require("ranges-ent-decode");
// or as an ES Module:
import decode from "ranges-ent-decode";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                            | Size   |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------- | ------ |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/ranges-ent-decode.cjs.js` | 3 KB   |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/ranges-ent-decode.esm.js` | 3 KB   |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/ranges-ent-decode.umd.js` | 109 KB |

**[⬆ back to top](#markdown-header-ranges-ent-decode)**

## Table of Contents

- [Install](#markdown-header-install)
- [TL;DR](#markdown-header-tldr)
- [Purpose](#markdown-header-purpose)
- [API](#markdown-header-api)
- [More on the algorithm](#markdown-header-more-on-the-algorithm)
- [Where's encode?](#markdown-header-wheres-encode)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## TL;DR

This is adapted version of [he.js](https://github.com/mathiasbynens/he) `decode()` with two differences:

1. the result is _array of ranges_ (not a string) and
2. it's decoding _recursively_.

All [he.js](https://github.com/mathiasbynens/he) unit tests were ported as well and do pass.

**[⬆ back to top](#markdown-header-ranges-ent-decode)**

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
  [3, 5] // <---- will just remove the slice from 3rd to 5th index
];
```

This library recursively decodes HTML entities and returns _ranges_. It does not change the string, it just tells you _what exactly_ should be changed and _where_.

**[⬆ back to top](#markdown-header-ranges-ent-decode)**

## API

Input: string and Optional Options Object.
Output: an array of zero or more range arrays.

### API - Input

| Input argument | Key value's type | Obligatory? | Description                                        |
| -------------- | ---------------- | ----------- | -------------------------------------------------- |
| `input`        | String           | yes         | Text you want to strip HTML tags from              |
| `opts`         | Plain object     | no          | The Optional Options Object, see below for its API |

If any input arguments supplied are in any other types, an error will be `throw`n.

**[⬆ back to top](#markdown-header-ranges-ent-decode)**

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

**[⬆ back to top](#markdown-header-ranges-ent-decode)**

### API - Output

An array of zero or more ranges (arrays) is returned.

For example: `[[2, 17, "&"], [20, 34, "&"]]`. Or empty (nothing to decode): `[]`.

In each range array, the first argument means "from" string index, the second means "up to" index.
The third argument, if present, means what to add. If absent, it means it's deletion of that string index range.

**[⬆ back to top](#markdown-header-ranges-ent-decode)**

## More on the algorithm

The biggest pain to code and the main [USP](https://en.wikipedia.org/wiki/Unique_selling_proposition) of this library is **being able to recursively decode and give the result as ranges**.

By _recursively_, we mean, the input string is decoded over and over until there's no difference in the result between previous and last decoding. Practically, this means we can tackle the unlikely, but possible cases of double and triple encoded strings, for example, this is a double-encoded string: `&amp;mdash;`. The original m-dash was turned into `&mdash;` on the first encoding round; then during second round its ampersand got turned into `&amp;` which lead to `&amp;mdash;`.

By _ranges_ we mean, the result is not a decoded string, but _instructions_ — what to change in that string in order for the string to be _decoded_. Practically, this means, we decode and don't lose the original character indexes. In turn, this means, we can gather more "instructions" (ranges) and join them later.

**[⬆ back to top](#markdown-header-ranges-ent-decode)**

## Where's encode?

If you wonder, where's `encode()` _in ranges_, we don't need it! When you traverse the string and gather ranges, you can pass each ~code point~ grapheme (where emoji of length six should be counted "one") through `he.js` encode, compare "before" and "after" and if the two are different, create a new range for it.

The `decode()` is not that simple because the input string has to be processed, you can't iterate grapheme-by-grapheme (or character-by-character, if you don't care about Unicode's astral characters).

**[⬆ back to top](#markdown-header-ranges-ent-decode)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/ranges-ent-decode/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/ranges-ent-decode/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-ranges-ent-decode)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

Some tests and some regexes adapted from he.js
MIT Licence - Copyright © 2013-2018 Mathias Bynens <https://mathiasbynens.be/>
https://github.com/mathiasbynens/he

[node-img]: https://img.shields.io/node/v/ranges-ent-decode.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/ranges-ent-decode
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/ranges-ent-decode
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/ranges-ent-decode/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/ranges-ent-decode?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/ranges-ent-decode
[downloads-img]: https://img.shields.io/npm/dm/ranges-ent-decode.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/ranges-ent-decode
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/ranges-ent-decode
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/ranges-ent-decode
