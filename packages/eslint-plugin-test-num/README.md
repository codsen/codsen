<div align="center">
  <img alt="eslint-plugin-test-num" src="https://glcdn.githack.com/codsen/codsen/raw/master/packages/eslint-plugin-test-num/media/repo_logo.gif" width="1144" align="center">
</div>

<div align="center"><p>ESLint plugin to update unit test numbers automatically</p></div>

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Idea](#idea)
- [Purpose](#purpose)
- [Setup](#setup)
- [Some basics](#some-basics)
- [Setup instructions](#setup-instructions)
- [PS.](#ps)
- [Contributing](#contributing)
- [Licence](#licence)

## Idea

The proper way to write unit tests is to put a identifier number in the test's title and in the test's message and **to automatically maintain both.**

![bunch of numbers to maintain](https://glcdn.githack.com/codsen/codsen/raw/master/packages/eslint-plugin-test-num/media/msg_00.png)

That's a lot of numbers to update manually, isn't it?

**[⬆ back to top](#)**

## Purpose

Consider the same failing test:

```js
t.true(api.hasOwnProperty("rules"));
```

[node-tap](https://node-tap.org/) terminal output will be:

![no message in a test](https://glcdn.githack.com/codsen/codsen/raw/master/packages/eslint-plugin-test-num/media/msg_01.png)

```js
t.true(api.hasOwnProperty("rules"), "some message");
```

terminal output:

![text message](https://glcdn.githack.com/codsen/codsen/raw/master/packages/eslint-plugin-test-num/media/msg_02.png)

```js
t.true(api.hasOwnProperty("rules"), "02");
```

terminal output:

![unique identifier number](https://glcdn.githack.com/codsen/codsen/raw/master/packages/eslint-plugin-test-num/media/msg_03.png)

Which output from those above do you prefer?

We prefer the last-one.

When there are more failing tests, problem is exaggerated:

![test roundup](https://glcdn.githack.com/codsen/codsen/raw/master/packages/eslint-plugin-test-num/media/msg_04.png)

Above, we can easily find test `01` by searching, but what are those other two unit tests?!?

How are we supposed to look for `"some message"`? Are we supposed to copy a message from terminal and search for it in the code?

Or are we supposed to memorise the message, scroll up many screens in the terminal and look for it visually? What if there are many identical messages from multiple failing unit tests?

Mind you, at the moment, this monorepo has 825,202 total assertions done in unit tests, with a median `50` across currently 114 packages...

There are lots of tests here!

**The proper way to write unit tests is to put an indentifier number in the title and in the message of each test and to automatically maintain both. That unique identifier is the main reference for a given test.**

This ESLint plugin automatically updates these numbers.

**[⬆ back to top](#)**

## Setup

First, make sure `eslint` itself is installed among the dev dependencies. "`i`" below means `install`, "`-D`" below means "dev dependency" (as opposed to a normal dependency). Quick refresher — when you publish an npm package and somebody installs it, its dev dependencies don't get installed when they `npm i` your package. That's the essence of how dev and normal dependencies differ.

Both `eslint` and `eslint-plugin-test-num` are for your program's testing, so we install them as "dev" dependencies, via `-D` flag:

```bash
npm i -D eslint
npm i -D eslint-plugin-test-num
```

**[⬆ back to top](#)**

## Some basics

Then, you need to configure ESLint to use the plugin.

As you know, ESLint is _pluggable_ which is the reason why it won over predecessors JSLint and JSHint — ESLint runs only the rules you asked for, and at the warning levels you asked for.

We need to do the _asking_.

We'll use an ESLint [configuration file](https://eslint.org/docs/user-guide/configuring). If you don't have a config file yet, you can nip the config file from another project and tweak it or, you can use initiation script `eslint --init`. Mind you, eslint configs are dot files which are hidden by the system. It's best practice [to make them visible](https://lmgtfy.com/?q=show+dot+files+in+mac).

But now, some basics first.

For example, the following rule configuration row:

```
"test-num/correct-test-num": "error",
```

means:

"set the rule "correct-test-num" from plugin "test-num" (which comes from npm package "eslint-plugin-test-num") to report findings at an "error" level.

**[⬆ back to top](#)**

## Setup instructions

We need to add `test-num` to the plugins section of your `.eslintrc` configuration file, for example, here's a real config file we use — notice the `"test-num"` in `"plugins"` key:

```json
{
  "env": {
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:test-num/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": ["test-num"],
  "ignorePatterns": [
    "**/eslint-plugin-test-num/rules/utils/**",
    "**/dist/**",
    "rollup.config.js",
    "**/tap/**"
  ],
  "rules": {
    "curly": "error",
    "no-constant-condition": [
      "error",
      {
        "checkLoops": false
      }
    ],
    "no-else-return": "error",
    "no-inner-declarations": "error",
    "no-unneeded-ternary": "error",
    "no-useless-return": "error",
    "no-var": "error",
    "one-var": ["error", "never"],
    "prefer-arrow-callback": "error",
    "prefer-const": "error",
    "prefer-template": "error",
    "test-num/correct-test-num": "error",
    "strict": "error",
    "symbol-description": "error",
    "yoda": [
      "error",
      "never",
      {
        "exceptRange": true
      }
    ]
  }
}
```

Reciting the ESLint documentation, rules can have different settings:

> "off" or 0 - turn the rule off
>
> "warn" or 1 - turn the rule on as a warning (doesn't affect exit code)
>
> "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
>
> https://eslint.org/docs/user-guide/configuring#configuring-rules

Which means, you can put `2` (as number, without quotes) or `"error"` (as string, so with quotes):

```json
{
  "rules": {
    "test-num/correct-test-num": 2
  }
}
```

or

```json
{
  "rules": {
    "test-num/correct-test-num": "error"
  }
}
```

Both are the same thing.

**[⬆ back to top](#)**

## PS.

Check out: `eslint-plugin-row-num` ([npm](https://www.npmjs.com/package/eslint-plugin-row-num)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/eslint-plugin-row-num/)) - it updates `console.log` row numbers so you know where exactly did that `console.log` came from. It's especially relevant when you Rollup your programs and tests are ran against a file different from source from which `console.log` originate.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=eslint-plugin-test-num%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aeslint-plugin-test-num%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=eslint-plugin-test-num%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aeslint-plugin-test-num%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=eslint-plugin-test-num%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aeslint-plugin-test-num%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/eslint-plugin-test-num
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/eslint-plugin-test-num
[downloads-img]: https://img.shields.io/npm/dm/eslint-plugin-test-num.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/eslint-plugin-test-num
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
