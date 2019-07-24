# string-fix-broken-named-entities

> Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes

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
- [API - Input](#api---input)
- [API - Output](#api---output)
- [`opts.decode`](#optsdecode)
- [`opts.cb` - a callback function](#optscb---a-callback-function)
- [`opts.progressFn` - another callback function](#optsprogressfn---another-callback-function)
- [Tips](#tips)
- [Why not regexes?](#why-not-regexes)
- [Practical use](#practical-use)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-fix-broken-named-entities
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`fixEnt`" you can name the consumed function however you want.

```js
// 1. consume via a require():
const fixEnt = require("string-fix-broken-named-entities");
//
// 2. or as an ES Module:
import fixEnt from "string-fix-broken-named-entities";
//
// 3. or for web pages, as a production-ready minified script file, straight from CDN:
<script src="https://cdn.jsdelivr.net/npm/string-fix-broken-named-entities/dist/string-fix-broken-named-entities.umd.js"></script>;
// then, you get a global variable "stringFixBrokenNamedEntities" which you consume like this:
const fixEnt = stringFixBrokenNamedEntities;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                           | Size   |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------- | ------ |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-fix-broken-named-entities.cjs.js` | 36 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-fix-broken-named-entities.esm.js` | 37 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-fix-broken-named-entities.umd.js` | 138 KB |

**[⬆ back to top](#)**

## Idea

The main purpose of this package is to fix broken named HTML entities, for example, `&nnbsp;` with repeated "n" is definitely an error and should be turned into `&nbsp;`.

Now, package like this does not function in a vacuum:

**First consideration** is format of the result. This package returns "everything" for each detected broken entity: index ranges of marking position, name, encoded and decoded values for example:

```
{
  ruleName: "bad-named-html-entity-malformed-nbsp",
  entityName: "nbsp",
  rangeFrom: 3,
  rangeTo: 8,
  rangeValEncoded: "&nbsp;",
  rangeValDecoded: "\xA0"
}
```

It's because "consumers" might require more or less information and it's impossible to cater all cases unless "everything" is given.

**Second consideration** is encoding/decoding. Maybe "consumers" will want everything, broken or right, decoded? This means, this package should be able to report positions of any named or numeric HTML entities found, so that consuming packages could then decode.

**Third consideration** is performance. We are already matching entities against 2127 known named entities (thanks to [all-named-html-entities](https://gitlab.com/codsen/codsen/tree/master/packages/all-named-html-entities)). This is costly resource-wise. Since we match all entities anyway, it's cheap to report also any recognised or invalid named HTML entities as well as numeric-ones. If we left this to separate package, it would traverse and match again. Why do the same thing twice?

**Fourth consideration** is numeric entities. Even though this package fixes named entities, it should report locations of all HTML entities, both named and numeric. This way consumers won't need to traverse the input second time, for numeric entities only.

**[⬆ back to top](#)**

## Usage

Normally the workflow goes like this. First, you tap the `ranges-push` to get the ranges manager and `ranges-apply` to "apply" ranges onto a string later.

Now, this library produces either ranges array or `null`. Latter is deliberate so that it is _falsey_. An empty array would have been _truthy_ and more clumsy to check. Either way, ranges manager, the JS Class, recognises `null` being pushed and skips it, so you can safely push the output of this library into ranges array:

```js
import Ranges from "ranges-push"; // you get a JS class
import rangesApply from "ranges-apply"; // you get a JS class
let rangesToDelete = new Ranges(); // create a new container
import fixEnt from "string-fix-broken-named-entities"; // import this library :)

// define some broken HTML:
const brokenStr = "x &nbbbsp; y";

// push output (if any) straight to our ranges container:
rangesToDelete.push(fixEnt(brokenStr));
// PS. The .push() above is custom method, not a Array.push(). It's named the same way because it's familiar and acts the same way. There is array underneath the Class actually, its helper functions are doing all the cleaning/sorting when values are pushed into a real, internal array.

// to retrieve the current state of ranges class, use .current() method:
// see full API at https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push/
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

**[⬆ back to top](#)**

## API - Input

| Input argument | Type         | Obligatory? | Description                                               |
| -------------- | ------------ | ----------- | --------------------------------------------------------- |
| `str`          | String       | yes         | Input string                                              |
| `opts`         | Plain object | no          | Pass the Optional Options Object here, as second argument |

**[⬆ back to top](#)**

### Optional Options Object

| Options Object's key | The type of its value | Default     | Description                                                                                                                                                 |
| -------------------- | --------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                    |                       |             |
| `decode`             | Boolean               | `false`     | Whatever is fixed, will be written in decoded form.                                                                                                         |
| `cb`                 | Function              | `undefined` | This callback works similar to `Array.forEach` and lets you customise the result, how ranges are formatted. Read the sepate section below for more details. |
| }                    |                       |             |

For example the Optional Options Object could be like this:

```js
{
  decode: false,
  cb: null
}
```

**[⬆ back to top](#)**

## API - Output

**Output**: array or arrays (_ranges_) OR `null`

## `opts.decode`

If you set `opts.decode` and there are healthy encoded entities, those will not be decoded. Only if there are broken entities, those will be set in ranges as decoded values. If you want full decoding, consider filter the input with [normal decoding library](https://www.npmjs.com/package/ranges-ent-decode) right after filtering using this library.

For example, you'd first filter the string using this library, `string-fix-broken-named-entities`. Then you'd filter the same input skipping already recorded ranges, using [ranges-ent-decode](https://www.npmjs.com/package/ranges-ent-decode). Then you'd merge the ranges.

**[⬆ back to top](#)**

## `opts.cb` - a callback function

So, normally, the output of this library is **an array** of zero or more arrays (each meaning string index _ranges_), for example:

```json
[[1, 2], [3, 4]]
```

Above means, delete string from index `1` to `2` and from `3` to `4`.

However, for example, in [`emlint`](https://www.npmjs.com/package/emlint), I need slightly different format, not only ranges but also **issue titles**:

```json
[
  {
    "name": "tag-generic-error",
    "position": [[1, 2]]
  },
  {
    "name": "tag-generic-error",
    "position": [[3, 4]]
  }
]
```

**Callback function** via `opts.cb` allows you to change the output of this library.

The concept is, you pass a function in option object's key `cb`. That function will receive a plain object with all "ingredients" under various keys. Whatever you return, will be pushed into results array. For each result application is about to push, it will call your function with findings, all neatly put in the plain object.

For example, to solve the example above, we would do:

```js
const fixEnt = require("string-fix-broken-named-entities");
const res = fixEnt("zzznbsp;zzznbsp;", {
  cb: oodles => {
    // "oodles" or whatever you name it, is a plain object.
    // Grab any content from any of its keys, for example:
    // {
    //   ruleName: "missing semicolon on &pi; (don't confuse with &piv;)",
    //   entityName: "pi",
    //   rangeFrom: 3,
    //   rangeTo: 4,
    //   rangeValEncoded: "&pi;",
    //   rangeValDecoded: "\u03C0"
    // }
    return {
      name: oodles.ruleName,
      position:
        oodles.rangeValEncoded != null
          ? [oodles.rangeFrom, oodles.rangeTo, oodles.rangeValEncoded]
          : [oodles.rangeFrom, oodles.rangeTo]
    };
  }
});
console.log(JSON.stringify(res, null, 4));
// => [
//      {
//        name: "malformed &nbsp;",
//        position: [3, 8, "&nbsp;"]
//      },
//      {
//        name: "malformed &nbsp;",
//        position: [11, 16, "&nbsp;"]
//      }
//    ]
```

Here's the detailed description of all the keys, values and their types:

| name of the key in the object in the first argument of a callback function | example value                                          | value's type                    | description                                                                                       |
| -------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------- |
| ruleName                                                                   | `missing semicolon on &pi; (don't confuse with &piv;)` | string                          | Full name of the issue, suitable for linters                                                      |
| entityName                                                                 | `pi`                                                   | string                          | Just the name of the entity, without ampersand or semicolon. Case sensitive                       |
| rangeFrom                                                                  | `3`                                                    | (natural) number (string index) | Shows from where to delete                                                                        |
| rangeTo                                                                    | `8`                                                    | (natural) number (string index) | Shows up to where to delete                                                                       |
| rangeValEncoded                                                            | `&pi;`                                                 | string or `null`                | Encoded entity or `null` if fix should just delete that index range and there's nothing to insert |
| rangeValDecoded                                                            | `\u03C0`                                               | string or `null`                | Decoded entity or `null` if fix should just delete that index range and there's nothing to insert |

**[⬆ back to top](#)**

### `opts.decode` in relation to `opts.cb`

Even though it might seem that when callback is used, `opts.decode` does not matter (because we serve both encoded and decoded values in callback), but **it does matter**.

For example, consider this case, where we have non-breaking spaces without semicolons:

```
&nbsp,&nbsp,&nbsp
```

Since we give user an option to choose between raw and encoded values, result can come in two ways:

- When decoded entities are requested, we replace ranges `[0, 5]`, `[6, 11]` and `[12, 17]`:

  ```js
  // ranges:
  [[0, 5, "\xA0"], [6, 11, "\xA0"], [12, 17, "\xA0"]];
  ```

- But, when encoded entities are requested, it's just a matter of sticking in the missing semicolon, at indexes `5`, `11` and `17`:

  ```js
  // ranges:
  [[5, 5, ";"], [11, 11, ";"], [17, 17, ";"]];
  ```

**[⬆ back to top](#)**

## `opts.progressFn` - another callback function

In web worker setups, a worker can return "in progress" values. When we put this package into a web worker, this callback function under `opts.progress` will be called with a string, containing a natural number, showing the percentage of the work done so far.

It's hard to show minimal worker application here but at least here's how the pinging progress works from the side of this npm package:

```js
// let's define a variable on a higher scope:
let count = 0;

// call application as normal, pass opts.progressFn:
const result = fixEnt(
  "text &ang text&ang text text &ang text&ang text text &ang text&ang text",
  {
    progressFn: percentageDone => {
      // console.log(`percentageDone = ${percentageDone}`);
      t.true(typeof percentageDone === "number");
      count++;
    }
  }
);
// each time percentage is reported, "count" is incremented

// now imagine if instead of incrementing the count, we pinged the
// value out of the worker
```

**[⬆ back to top](#)**

## Tips

You can save time and improve the workflow by making use of other range- class libraries:

- [ranges-push](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-push) manages ranges: sorts and merges them. Instead of pushing into an array, you push into a Class which performs all cleaning. You can fetch the current contents using `.current()` method.
- [ranges-apply](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply) applies ranges onto a string, producing a result string: ranges without third element mean deletion, ranges with the third element mean replacement. That library does all those deletions/replacements according to a given ranges array.

There are [other libraries](https://gitlab.com/codsen/codsen/tree/master#-11-range-libraries) for [cropping](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-crop), [sorting](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-sort), [merging](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-merge), performing regex-to-range [searches](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-regex) and others.

**[⬆ back to top](#)**

## Why not regexes?

If you think about it, each regex will perform a search on a string. That's one full traversal of all indexes in a string. No matter how well it's optimised by the Node or browser, it is going to happen. Now, this library traverses the input string **only once** and registers all errors. You can't do that easily with regexes - the resulting regex would get unwieldy and hard to debug.

Furthermore, the rules in this library's algorithm are too complex for regexes, we use an equivalent of lookarounds and heavily rely on surroundings of a particular character we're evaluating. For example, here's how we detect the ending of a **confirmed broken nbsp**:

- we have detected its beginning (with the ampersand or "n" or "b" or "s" or "p" characters in case ampersand was missing)
- characters in the "chunk" comprise of at least three types of: `["n", "b", "s", "p"]`
- the chunk includes a semicolon, or one is missing and
- current character is not a semicolon
- the character that follows either does not exist (EOL) or is not a semicolon (to catch extra characters between nbsp and semicolon)
- the ending letter is either: a) outside of a string loop (we traverse string length + 1 to complete all clauses) OR b) one of 2 cases: 1) all letters of a set "n", "b", "s" and "p" have been matched at least once and ending letter is not equal to the one before (no repetition in the ending) OR ending letter is not any of a set: "n", "b", "s" and "p" (case insensitive).

Good luck putting the above in a regex and later troubleshooting it, after a few months.

**[⬆ back to top](#)**

## Practical use

This library was initially part of [Detergent.js](https://gitlab.com/codsen/codsen/tree/master/packages/detergent) and was taken out, rewritten; its unit tests were beefed up and consolidated and appropriately organised. Almost any tool that deals with HTML can make use of this library, especially, since it **only reports what was done** (instead of returning a mutated string which is up to you to compare and see what was done). It's easy to catch false positives this way.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-fix-broken-named-entities%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-fix-broken-named-entities%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-fix-broken-named-entities%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-fix-broken-named-entities%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-fix-broken-named-entities%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-fix-broken-named-entities%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/string-fix-broken-named-entities.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/string-fix-broken-named-entities
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-fix-broken-named-entities
[cov-img]: https://img.shields.io/badge/coverage-93.89%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-fix-broken-named-entities
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/string-fix-broken-named-entities
[downloads-img]: https://img.shields.io/npm/dm/string-fix-broken-named-entities.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/string-fix-broken-named-entities
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/string-fix-broken-named-entities
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
