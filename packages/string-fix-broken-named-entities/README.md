# string-fix-broken-named-entities

> Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [API - Input](#api-input)
- [API - Output](#api-output)
- [`opts.decode`](#optsdecode)
- [`opts.cb` - a callback function](#optscb-a-callback-function)
- [`opts.entityCatcherCb`](#optsentitycatchercb)
- [`opts.progressFn` - progress callback](#optsprogressfn-progress-callback)
- [Tips](#tips)
- [Why not regexes?](#why-not-regexes)
- [Practical use](#practical-use)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i string-fix-broken-named-entities
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`fixEnt`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const fixEnt = require("string-fix-broken-named-entities");
```

or as an ES Module:

```js
import fixEnt from "string-fix-broken-named-entities";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/string-fix-broken-named-entities/dist/string-fix-broken-named-entities.umd.js"></script>
```

```js
// in which case you get a global variable "stringFixBrokenNamedEntities" which you consume like this:
const fixEnt = stringFixBrokenNamedEntities;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                           | Size   |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------- | ------ |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/string-fix-broken-named-entities.cjs.js` | 36 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/string-fix-broken-named-entities.esm.js` | 37 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/string-fix-broken-named-entities.umd.js` | 139 KB |

**[⬆ back to top](#)**

## API - Input

The `fixEnt` you required/imported is a function and it has two input arguments:

| Input argument | Type         | Obligatory? | Description                                        |
| -------------- | ------------ | ----------- | -------------------------------------------------- |
| `input`        | String       | yes         | String, hopefully HTML code                        |
| `opts`         | Plain object | no          | The Optional Options Object, see below for its API |

For example:

```js
const fixEnt = require("string-fix-broken-named-entities");
const result = fixEnt("&nsp;x&nsp;y&nsp;");
console.log(JSON.stringify(result, null, 4));
// => [[0, 5, "&nbsp;"], [6, 11, "&nbsp;"], [12, 17, "&nbsp;"]]
```

**[⬆ back to top](#)**

### Optional Options Object

| An Optional Options Object's key | Type of its value | Default   | Description                                                                                                                                           |
| -------------------------------- | ----------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                                |                   |           |
| `decode`                         | Boolean           | `false`   | Fixed values are normally put as HTML-encoded. Set to `true` to get raw characters instead.                                                           |
| `cb`                             | Function          | see below | Callback function which gives you granular control of the program's output                                                                            |
| `entityCatcherCb`                | Function          | `null`    | If you set a function here, every encountered entity will be passed to it, see a dedicated chapter below                                              |
| `progressFn`                     | Function          | `null`    | Used in web worker setups. You pass a function and it gets called one for each natural number `0` to `99`, meaning percentage of the work done so far |
| }                                |                   |           |

Here it is in one place:

```js
{
  decode: false,
  cb: ({ rangeFrom, rangeTo, rangeValEncoded, rangeValDecoded }) =>
    rangeValDecoded || rangeValEncoded
      ? [rangeFrom, rangeTo, opts.decode ? rangeValDecoded : rangeValEncoded]
      : [rangeFrom, rangeTo],
  entityCatcherCb: null,
  progressFn: null
}
```

**[⬆ back to top](#)**

## API - Output

**Output**: array of zero or more arrays (_ranges_).

For example, four fixed `nbsp`'s:

```js
[
  [6, 11, "&nbsp;"],
  [11, 18, "&nbsp;"],
  [27, 34, "&nbsp;"],
  [34, 41, "&nbsp;"]
];
```

## `opts.decode`

If you set `opts.decode` and there are healthy encoded entities, those will not be decoded. Only if there are broken entities, those will be set in ranges as decoded values. If you want full decoding, consider filter the input with [normal decoding library](https://www.npmjs.com/package/ranges-ent-decode) right after filtering using this library.

For example, you'd first filter the string using this library, `string-fix-broken-named-entities`. Then you'd filter the same input skipping already recorded ranges, using [ranges-ent-decode](https://www.npmjs.com/package/ranges-ent-decode). Then you'd merge the ranges.

For example:

```js
const fixEnt = require("string-fix-broken-named-entities");
const result = fixEnt("zz nbsp;zz nbsp;", { decode: true });
console.log(JSON.stringify(result, null, 4));
// => [[3, 8, "\xA0"], [11, 16, "\xA0"]]
```

**[⬆ back to top](#)**

## `opts.cb` - a callback function

So, normally, the output of this library is **an array** of zero or more arrays (each meaning string index _ranges_), for example:

```json
[
  [1, 2],
  [3, 4]
]
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
  [
    [0, 5, "\xA0"],
    [6, 11, "\xA0"],
    [12, 17, "\xA0"]
  ];
  ```

- But, when encoded entities are requested, it's just a matter of sticking in the missing semicolon, at indexes `5`, `11` and `17`:

  ```js
  // ranges:
  [
    [5, 5, ";"],
    [11, 11, ";"],
    [17, 17, ";"]
  ];
  ```

**[⬆ back to top](#)**

## `opts.entityCatcherCb`

If broken entities are pinged to `opts.cb()` callback, all healthy entities are pinged to `opts.entityCatcherCb`. It's either one of another:

```js
const inp1 = "y &nbsp; z &nsp;";
const gatheredEntityRanges = [];
fix(inp1, {
  entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to])
});
console.log(
  `${`\u001b[${33}m${`gatheredEntityRanges`}\u001b[${39}m`} = ${JSON.stringify(
    gatheredEntityRanges,
    null,
    4
  )}`
);
// => [[2, 8]]
```

**[⬆ back to top](#)**

## `opts.progressFn` - progress callback

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
      t.ok(typeof percentageDone === "number");
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

Our algorithm is way waay more complex than anything that can be achieved using regexes. We tackle the task using mix of different algorithms: looking for known entity names, counting letters (in nbsp case only) and calculating the minimum-sample which would pass as an nbsp, looking for known broken patterns — many ways. It would be impossible to achieve this using regexes.

**[⬆ back to top](#)**

## Practical use

This library was initially part of [Detergent.js](https://gitlab.com/codsen/codsen/tree/master/packages/detergent) and was taken out, rewritten; its unit tests were beefed up and consolidated and appropriately organised. Almost any tool that deals with HTML can make use of this library, especially, since it **only reports what was done** (instead of returning a mutated string which is up to you to compare and see what was done). It's easy to catch false positives this way.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-fix-broken-named-entities%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-fix-broken-named-entities%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-fix-broken-named-entities%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-fix-broken-named-entities%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=string-fix-broken-named-entities%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Astring-fix-broken-named-entities%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/string-fix-broken-named-entities
[cov-img]: https://img.shields.io/badge/coverage-94.36%25-brightgreen.svg?style=flat-square
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
