# EMLint

> Non-parsing static code analysis tool for HTML mixed with anything

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
- [Two aims](#two-aims)
- [Idea](#idea)
- [Description for the final product we're aiming](#description-for-the-final-product-were-aiming)
- [API](#api)
- [Example](#example)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i emlint
```

Consume via a `require()`:

```js
const { lint, version } = require("emlint");
```

or as an ES Module:

```js
import { lint, version } from "emlint";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/emlint/dist/emlint.umd.js"></script>
```

```js
// in which case you get a global variable "emlint" which you consume like this:
const { lint, version } = emlint;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                 | Size   |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------- | ------ |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/emlint.cjs.js` | 111 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/emlint.esm.js` | 114 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/emlint.umd.js` | 312 KB |

**[⬆ back to top](#)**

## Two aims

1. To catch HTML and CSS code errors, including things that make code unparseable.
2. To catch bad email template code patterns which cause rendering bugs.

## Idea

Currently, the [Litmus](https://www.crunchbase.com/organization/litmus) and [Email on Acid](https://www.crunchbase.com/organization/emailonacid) are leading providers in Email Development industry. After coding up the template, developer sends the test email to their services and visually evaluates the screenshots of the template, prepared on various platforms (like Android), email consumption programs (like Outlook) and webmail clients (like gmail.com).

Such code error-checking process is tedious and inefficient.

Code errors should be detected right in the code editor, while developer is typing.

The primary challenge is, email templates use templating language code for dynamic variables such as `${customer.firstName}`. It can be Mailchimp, Oracle Responsys, Campaign Monitor proprietary templating literals, it can be pure templating languages like Nunjucks, Liquid or others, it can be programming languages like Java or Python or Go. There are many ways to achive templating and manage the code module assembly. One thing is sure — HTML and CSS is always not pure.

This means, proper linter **can't be parsing**.

The brackets can be templating literal logic greater/lesser than signs:

```
<span {% if product.count > 1 %} ...>
```

or worse, here a templating language tries to URL-encode, concatenating string from quoted apostrophes (no HTML parser can cope with that):

```
<a href="https://qrs?tuv={{ mn.op | replace(" ", "+") | replace("'", "%27") | replace("&", "%26") | replace("(", "%28") | replace(")", "%29") }}"
```

Furthermore, code bugs often cause parsing errors. It is stupid for a tool to demand that code should be parseable in order to find errors in it. It's like requiring patients to pass military health test in order to be admitted to a hospital.

All admitted patients will be healthy (negating the purpose of hospital) and no sick patients will end up treated.

Same with the HTML/CSS code (both web and email actually) — for example, current HTML linters in the market will not tell you if you accidentally put a space after opening bracket (like [Kangax minifier](http://kangax.github.io/html-lint/)).

Current HTML/CSS linters are also not email-template friendly, have convoluted API's and often are not coded up on modern tooling (Rollup, Babel, ES6+ source, ESLint, Prettier etc).

**[⬆ back to top](#)**

## Description for the final product we're aiming

This is a linter API, still in _a baby state_ but eventually it will able to detect **all** of the following:

- HTML/CSS code errors, especially ones that make code un-parseable
- Missing tags and single characters
- Messed up tags and rogue characters
- Redundant tags and characters
- Enforce tag patterns such as _Hybrid Email_ or _Outlook Shadow Code_
- If would be nice to detect chunks of _shifted code_ (nobody has done it before)
- Email-specific feature, detect issues with Micro\$oft VML objects (for example, the output of [backgrounds.cm](https://backgrounds.cm)) - both bugs and settings considering surrounding code
- Check the shadow code which is commented-out
- Modern JS tooling, API and setup

**Other features:**

- This is an API. It is a _function_, decoupled from both: CLI operations and anything file-system-related (reading/writing files). Let other CLI's and web apps and Electron apps tap this API.
- Work with as little or as much of HTML file as it is given. Unless you explicitly request to treat input as the final, complete HMTL document. Often linters expect only the latter case and are not suitable to lint snippets, partials and code pieces.
- It would be nice to heuristically recognise logical blocks such as "if" and "for". After all, `%%_if_%%`, `${if(...)}` and `_if__` are just three kinds of the same, "if" statement, right?
- Anticipate and be cool with "blind spots" — areas where algorithm just gave up.

**PS.** This is not a _validator_ (like [W3C Markup Validator](https://validator.w3.org)). It's a tool to patch up errors **BEFORE** you feed your code to a validator. It's a tool to save you time looking for that missing bracket in your email template. It's a tool that will tell you upfront if your template will look messed up in Outlook.

**[⬆ back to top](#)**

## API

This library exports _a plain object_. The main function `emlint()` and other goodies are placed under **keys** of that plain object, which you should consume by [destructuring what you `import`ed/`require`d](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). For example:

```js
const { emlint, version } = require("emlint");
// or:
import { emlint, version } from "emlint";
```

Above, the [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) operation grabs all the values from those keys and dumps them in variable constants. Here they are:

| Key       | Type     | Description                                                                |
| --------- | -------- | -------------------------------------------------------------------------- |
| `emlint`  | Function | Main function to which you feed your code (as a string); see its API below |
| `version` | String   | Taken straight from `package.json`. Should match what's on npm.            |

**[⬆ back to top](#)**

### API - `emlint()` - input

**emlint(str, \[opts])** — in other words, it's a _function_, which takes two arguments:

1. **first** argument — string,
2. optional (marked with square brackets above) **second** argument — _An Optional Options Object_ — a plain object

| `emlint()` input argument | Arbitrary name | Type         | Obligatory? | Description                                        |
| ------------------------- | -------------- | ------------ | ----------- | -------------------------------------------------- |
| 1st                       | `str`          | String       | yes         | The input string of zero or more characters        |
| 2nd                       | `opts`         | Plain object | no          | An Optional Options Object. See below for its API. |

If supplied input arguments are of any other types, an error will be thrown.

**[⬆ back to top](#)**

## Example

Below, we tap this API/package/library, feed some code into it and `console.log` what it returns. Optional Options Object (2nd input argument) is omitted:

```js
// consume as normal require():
const { emlint, version } = require("emlint");
// define the input piece of code as string:
const input = "<    table>";
// emlint() is a function, so feed that string with code into it:
const res = emlint(input);
// PS. options are omitted, so we're running on defaults
console.log("res = " + JSON.stringify(res, null, 4));
// PPS. We use JSON.stringify because output is a plain object and we want it
// nicely printed. That "4" above means "indent by 4 spaces".
```

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=emlint%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aemlint%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=emlint%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aemlint%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=emlint%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aemlint%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/emlint.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/emlint
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/emlint
[cov-img]: https://img.shields.io/badge/coverage-90.37%25-brightgreen.svg?style=flat-square
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
