# tap-parse-string-to-object

> Parses raw Tap: string-to-object or stream-to-a-promise-of-an-object

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
- [Synchronous Example](#synchronous-example)
- [Asynchronous Example](#asynchronous-example)
- [API](#api)
- [Parser's Algorithm](#parsers-algorithm)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i tap-parse-string-to-object
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`parseRawTap`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const parseRawTap = require("tap-parse-string-to-object");
```

or as an ES Module:

```js
import parseRawTap from "tap-parse-string-to-object";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/tap-parse-string-to-object/dist/tap-parse-string-to-object.umd.js"></script>
```

```js
// in which case you get a global variable "tapParseStringToObject" which you consume like this:
const parseRawTap = tapParseStringToObject;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                     | Size   |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------- | ------ |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/tap-parse-string-to-object.cjs.js` | 6 KB   |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/tap-parse-string-to-object.esm.js` | 5 KB   |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/tap-parse-string-to-object.umd.js` | 123 KB |

**[⬆ back to top](#)**

## Idea

This library is a basic raw [Tap](https://node-tap.org/) parser, string-to-object.

It is aimed to parse Tap raw test output saved into files using `tap -o`.

Existing Tap parsers like [tap-parser](https://www.npmjs.com/package/tap-parser) are aimed at operations in the terminal; they consume piped output there and return streams.

This program is similar to `JSON.parse` except that it works synchronously and asynchronously, depending on what you give:

- if you (synchronously) give it a **string**, it will (synchronously) output a **plain object**
- if you (synchronously) give it a **stream** of a raw Tap string, it will output a promise of a **plain object**

In both cases, the plain object will look like this:

```js
{
  ok: true,
  assertsTotal: 8,
  assertsPassed: 8,
  assertsFailed: 0,
  suitesTotal: 2,
  suitesPassed: 2,
  suitesFailed: 0
}
```

It is not fancy — it won't give you test names — but it will extract the totals of all asserts and all suites.

We are going to use it ourselves to compile stats of all our unit tests.

**[⬆ back to top](#)**

## Synchronous Example

String-in, plain object-out:

```js
const parseRawTap = require("tap-parse-string-to-object");
const res = parseRawTap(`TAP version 13
ok 1 - test/test.js # time=22.582ms { # Subtest: 01.01 - string input
ok 1 - 01.01.01
ok 2 - 01.01.02
1..2
ok 1 - 01.01 - string input # time=7.697ms

 # Subtest: 01.02 - non-string input
ok 1 - 01.02.01
ok 2 - 01.02.02
ok 3 - 01.02.03
ok 4 - 01.02.04
ok 5 - 01.02.05
1..5
ok 2 - 01.02 - non-string input # time=2.791ms

 1..2 # time=22.582ms
}

ok 2 - test/umd-test.js # time=16.522ms { # Subtest: UMD build works fine
ok 1 - should be equivalent
1..1
ok 1 - UMD build works fine # time=10.033ms

 1..1 # time=16.522ms
}

1..2

# time=1816.082ms
`);
console.log(`res = ${JSON.stringify(res, null, 4)}`);
// {
//   ok: true,
//   assertsTotal: 8,
//   assertsPassed: 8,
//   assertsFailed: 0,
//   suitesTotal: 2,
//   suitesPassed: 2,
//   suitesFailed: 0
// }
```

**[⬆ back to top](#)**

## Asynchronous Example

Stream-in, promise of a plain object-out:

```js
const fs = require("fs");
const path = require("path");
const parseRawTap = require("tap-parse-string-to-object");

// notice we put this async IIFE to be able to await the promise:
(async () => {
  // 1. define file's contents
  const filesContent = `TAP version 13
ok 1 - test/test.js # time=22.582ms { # Subtest: 01.01 - string input
ok 1 - 01.01.01
ok 2 - 01.01.02
1..2
ok 1 - 01.01 - string input # time=7.697ms

# Subtest: 01.02 - non-string input
ok 1 - 01.02.01
ok 2 - 01.02.02
ok 3 - 01.02.03
ok 4 - 01.02.04
ok 5 - 01.02.05
1..5
ok 2 - 01.02 - non-string input # time=2.791ms

1..2 # time=22.582ms
}

ok 2 - test/umd-test.js # time=16.522ms { # Subtest: UMD build works fine
ok 1 - should be equivalent
1..1
ok 1 - UMD build works fine # time=10.033ms

1..1 # time=16.522ms
}

1..2

# time=1816.082ms
`;

  // 2. write the test file
  await fs.writeFile(path.resolve("sampleTestStats.md"), filesContent);

  // 3. now read it again, but as a stream
  const contentsAsStream = fs.createReadStream(
    path.resolve("sampleTestStats.md")
  );

  // 4. a promise (which we await) is returned and it yields a plain object:
  const result = await parse(contentsAsStream);
  console.log(JSON.stringify(result, null, 4));
  // => {
  //      ok: true,
  //      assertsTotal: 8,
  //      assertsPassed: 8,
  //      assertsFailed: 0,
  //      suitesTotal: 2,
  //      suitesPassed: 2,
  //      suitesFailed: 0
  //    }
})();
```

**[⬆ back to top](#)**

## API

API depends on what you give as an input:

- if you (synchronously) provide a `string`, you'll (synchronously) receive a plain object
- if you provide (synchronously) provide a stream, you'll receive a promise of a plain object

The whole idea with streams is that raw test output files can be big — for example `detergent`'s ([npm](https://www.npmjs.com/package/detergent)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/detergent/)) raw Tap output is around 250MB, there are ~750,000 assertions there. Reading and processing such file synchronously would cripple even 8-core Intel i9 laptop. But the same file can be easily processed with streams.

However, we keep the string input as an alternative for peoples' convenience: maybe somebody just wants to play around and doesn't want to `await`? Be our guest — the synchronous result is given; just (synchronously) put a string into the inputs (promise yielding a string won't do).

In both cases, the result is similar to the described above:

```JSON
{
  ok: true,
  assertsTotal: 8,
  assertsPassed: 8,
  assertsFailed: 0,
  suitesTotal: 2,
  suitesPassed: 2,
  suitesFailed: 0
}
```

**[⬆ back to top](#)**

## Parser's Algorithm

We wrote our own little parser. In essence, it counts all lines that (when trimmed) start with "ok" and "not ok", with condition that those lines are consecutive and located after a line which contains a string "# Subtest".

Each opening curlie brace bumps the suite count.

The exception for all above is chunks we skip — everything between line with three dashes (`---`) and line with three dots (`...`).

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=tap-parse-string-to-object%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Atap-parse-string-to-object%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=tap-parse-string-to-object%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Atap-parse-string-to-object%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=tap-parse-string-to-object%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Atap-parse-string-to-object%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/tap-parse-string-to-object.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/tap-parse-string-to-object
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/tap-parse-string-to-object
[cov-img]: https://img.shields.io/badge/coverage-92.55%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/tap-parse-string-to-object
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/tap-parse-string-to-object
[downloads-img]: https://img.shields.io/npm/dm/tap-parse-string-to-object.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/tap-parse-string-to-object
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/tap-parse-string-to-object
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
