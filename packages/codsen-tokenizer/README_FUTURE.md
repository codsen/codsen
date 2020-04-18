# codsen-tokenizer

> Tokenizer for mixed inputs aiming at broken code, especially HTML & CSS

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
- [Highlights](#highlights)
- [Versus competition](#versus-competition)
- [API](#api)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i codsen-tokenizer
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`tokenizer`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const tokenizer = require("codsen-tokenizer");
```

or as an ES Module:

```js
import tokenizer from "codsen-tokenizer";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/codsen-tokenizer/dist/codsen-tokenizer.umd.js"></script>
```

```js
// in which case you get a global variable "codsenTokenizer" which you consume like this:
const tokenizer = codsenTokenizer;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                           | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------ | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/codsen-tokenizer.cjs.js` | 23 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/codsen-tokenizer.esm.js` | 24 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/codsen-tokenizer.umd.js` | 42 KB |

**[⬆ back to top](#)**

## Purpose

The purpose of this tokenizer is to split code-as-string into chunks (tokens), plain objects.

It's up to you what you are going to do with those tokens — for example, `codsen-parser` ([npm](https://www.npmjs.com/package/codsen-parser)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/codsen-parser/)) will build AST's from tokens and `emlint` ([npm](https://www.npmjs.com/package/emlint)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/emlint/)) will traverse the AST using `ast-monkey` ([npm](https://www.npmjs.com/package/ast-monkey)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey/)) searching for code errors.

**[⬆ back to top](#)**

## Highlights

This tokenizer is aimed at processing **broken code**, HTML mixed with other languages.

- Can recognise **fatal** HTML/CSS errors — you won't surprise the tokenizer — the tokenizer will surprise _you_
- Aimed at **HTML** and **CSS** mixed with anything.
- Parses email _shadow code_ — commented-out code structures
- Heuristically recognises ESP (Email Service Provider) templating tags (for example, `*|customer.name|*` or `{% if purchase.total < 100 %}` — notice the bracket)

**[⬆ back to top](#)**

## Versus the competition

Let's take an example of a `div` with a **fatal error** — a missing opening bracket: `div class="zz">`

All the common parsers/tokenizers in the market currently: Angular parser, HTMLParser2, Hyntax, Parse5, PostHTML-parser, svelte parser, vue parser **will not see it as a tag**, same way like the browser will not see it as a tag.

This means, tools based on such parsers can't be used to detect FATAL ERRORS in the code.

**This is the reason why the current HTML linters in the market are so primitive**.

Here's where `codsen-tokenizer` comes in.

Reusing our example of fatal error div, `div class="zz">`. Here's the plan:

**FIRST STEP.**

`codsen-tokenizer` correctly recognises `div class="zz">` _as a tag_, yielding:

```
[
    {
        "type": "tag",
        "start": 0,
        "end": 15,
        "value": "div class=\"zz\">",
        ...
        "attribs": [
            {
                "attribName": "class",
                ...
                "attribStart": 4,
                "attribEnd": 14
            }
        ]
    }
]
```

**SECOND STEP**

the parser such as `codsen-parser` can assemble the correct AST

**THIRD STEP**

linters such as `emlint` can check, does the token's `start` index fall upon an opening bracket. It does not in this case — but we can automatically fix this issue because we know where the bracket is missing.

**FOURTH STEP**

after our tooling restores the opening bracket, the other tooling — browsers, inferior parsers etc. — can operate correctly.

**[⬆ back to top](#)**

## API

It will be published once the API stabilises.

**[⬆ back to top](#)**

## More thoughts

Conceptually, good tooling should be user-oriented. For example, if you make a code checker which says "The parser got fatal error", this is not a user-oriented program. Me, as a user, I don't care about innards of your program — its parser especially. Tell me what _I_ did wrong and _how to fix it_ — don't tell me cryptic meaningless messages.

For example, humanity is pouring money into OpenJS Foundation. People work on it full-time. But ESLint is still based on a parser — if your code error manages to break the parser, it won't tell you where the error is, only that you broke the parser!

For example, it is possible to omit the semicolon in ESLint causing a fatal parser error and you won't find where it is omitted. Good luck trawling 1000 lines of code!

In order to find the fatal code errors, the tokenizer has to be by magnitude more lenient than the code spec (in this case ECMA standard).

In other words, if an error is fatal and breaks parser, tooling running on such parser will never be able to correctly identify such error.

**[⬆ back to top](#)**

## Perf

I admit, the more we beef up the algorithms the more the performance drops. A stupid, fragile parser which only follows the spec will be faster than a smart parser which calculates a hundred types of possible errors.

For example, when a lexer (tokenizer) traverses the HTML attribute and meets the quote which matches the first opening quote, does it call it a day?

```
<img src='test.png' alt='Freakin' error!"/>
                                |       |
                                |       |
                          is this    or this?
                  the attribute's
                          ending?
```

Notice the double whammy error — mismatching quote pair and unencoded quote within an attribute's value!

If lexer does call it a day when it meets the first matching quote, it will be faster but won't cope with quote-mismatch errors.

If lexer does not call it a day and looks around, it impacts the perf but it can cope with quote-mismatch errors.

Former is the approach of parsers in the market. Latter is the approach of `codsen-tokenizer`.

Does Humanity deserve to have tooling which recognises errors THAT FATAL?

I believe it does.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=codsen-tokenizer%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acodsen-tokenizer%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=codsen-tokenizer%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acodsen-tokenizer%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=codsen-tokenizer%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Acodsen-tokenizer%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/codsen-tokenizer.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/codsen-tokenizer
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer
[cov-img]: https://img.shields.io/badge/coverage-92.84%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/codsen-tokenizer
[downloads-img]: https://img.shields.io/npm/dm/codsen-tokenizer.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/codsen-tokenizer
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/codsen-tokenizer
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
