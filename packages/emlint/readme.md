# Emlint

> Detects errors in HTML/CSS, proposes fixes, email-template friendly

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#markdown-header-install)
- [Idea](#markdown-header-idea)
- [Description for final product](#markdown-header-description-for-final-product)
- [API](#markdown-header-api)
- [Breaking rules](#markdown-header-breaking-rules)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i emlint
```

```js
const { emlint, version } = require("emlint");
// or:
import { emlint, version } from "emlint";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                 | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/emlint.cjs.js` | 15 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/emlint.esm.js` | 15 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/emlint.umd.js` | 37 KB |

**[⬆ back to top](#)**

## Idea

Let's lint our email templates. This library is still a baby but rules count is growing.

## Description for final product

This will be a tool to detect fundamental errors in pure (X)HTML or (X)HTML-mixed-with-something:

- Missing tags
- Redundant tags
- Detecting and checking tag patterns such as _Hybrid Email_ or _Outlook Shadow Code_
- Some cases where chunks of code were moved
- Micro\$oft VML objects (for example, the output of [backgrounds.cm](https://backgrounds.cm)) (Email Template-specific feature)
- Will check (X)HTML with as little or as much tags as you want: one tag is fine, whole document is fine. Validators won't work on pieces of HTML but we're fine with that (unless you explicitly instruct to treat input as a whole document).

It is a stupid idea to use a _parser_ to look for errors because HTML code can be _unparseable_ because of those errors. If it's _parseable_, it's already fixed. Logical, right?

That's why ESLint maintainers are elbow-deep coding Espree/Acorn parsers. Still, I (Roy) believe that parsing mindset is limiting and eventually stiffles the algorithmic creativity and program feature ambitions.

For example, can code checking tool heuristically analyse the code and tackle all (or most) templating languages **without plugins**? After all, `%%_if_%%`, `${if(...)}` and `_if__` are just three kinds of the same, "if" statement, right. We might not know for sure, but algorithm at least can take the most likely guess. Is it too hard to make smart applications?

In this tool, we anticipate that there will be "black spots" in the code which parser will not recognise. That's fine. Piece of Java code, piece of Nunjucks with some "greater than" signs, _cough_ mixed in the same file — no problem (at least not for this application).

We try to **analyse a string** (a text, which _might_ be (X)HTML code) and we report what we detected. Not more, not less.

This library accepts **(X)HTML** in various shapes:

- (X)HTML can be pure or mixed with other sources
- (X)HTML can be incomplete — algorithm is smart and will not complain that `doctype` is missing if you don't even have `<head>` and `<body>` tags
- (X)HTML can be email template code or not — we treat email HTML and webpage HTML as equals

This is not a _validator_ (like [W3C Markup Validator](https://validator.w3.org)). It's a tool to patch up errors **BEFORE** you feed your code to a validator. It's a tool to save you time looking for that missing bracket in your email template.

Our aim is to make the most advanced (X)HTML linting tool that humanity has ever produced.

**[⬆ back to top](#)**

## API

This library exports _a plain object_. The main function `emlint()` and other goodies are placed under keys of that plain object, which you should consume by [destructuring that object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment):

```js
const { emlint, version } = require("emlint");
// or:
import { emlint, version } from "emlint";
```

Above, [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) operation grabs all the values from those keys and dumps them in variable constants. Here they are:

| Key       | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| `emlint`  | Function | Main function to which you feed your string; see its API below |
| `version` | String   | Taken from `package.json`. Should match what's on npm.         |

**[⬆ back to top](#)**

### API - emlint() - input

**emlint(str, \[opts])** — in other words, function, which takes two arguments:

1. first argument — string,
2. optional (marked with square brackets above) second argument — An Optional Options Object — a plain object

| Input argument | Key value's type | Obligatory? | Description                                        |
| -------------- | ---------------- | ----------- | -------------------------------------------------- |
| `str`          | String           | yes         | The input string of zero or more characters        |
| `opts`         | Plain object     | no          | An Optional Options Object. See below for its API. |

If supplied input arguments are of any other types, an error will be thrown.

For example:

```js
// consume as normal require():
const { emlint, version } = require("emlint");
// define the input piece of code as string:
const input = "<    table>";
// emlint() is a function, so feed that string with code into it:
const res = emlint(input);
// PS. options are omitted, so we're running on defaults
console.log("res = " + JSON.stringify(res, null, 4));
```

**[⬆ back to top](#)**

## Breaking rules

If you looked at this or any project code in this monorepo you probably noticed we're breaking many "best practice" rules:

- We use copious amounts of `console.log` for debugging and we keep all those `console.log`s in the source of the application. Rollup will build _production_ build and strip all logging automatically. But this allows us to use command line arguments to ask Rollup for _dev_ build, where `console.log`s are intact, [with line numbers](https://www.npmjs.com/package/js-row-num-cli). This allows app to granularly report what happens where. In terminal. In color.
- We know functional vs. imperative programming styles and actually prefer imperative.
- We hate when software is split into _gajillion_ of different files. We like **"one library—one file—one package"** way. Ok, sometimes there's two files, `util.js` but only for unit test coverage purposes.

We say "we" but it's me, Roy mainly, addressing himself in 3rd person.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?title=emlint%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?title=emlint%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https:/gitlab.com/codsen/codsen/issues/new?title=emlint%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/emlint.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/emlint
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/emlint
[cov-img]: https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/emlint
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/emlint
[downloads-img]: https://img.shields.io/npm/dm/emlint.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/emlint
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/emlint
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
