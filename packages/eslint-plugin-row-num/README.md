<div align="center">
  <img alt="eslint-plugin-row-num" src="https://glcdn.githack.com/codsen/codsen/raw/master/packages/eslint-plugin-row-num/media/repo_logo.png" width="480" align="center">
</div>

<div align="center"><p>ESLint rule to update row numbers on each console.log</p></div>

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Setup](#setup)
- [Some basics](#some-basics)
- [Setup instructions](#setup-instructions)
- [Contributing](#contributing)
- [Licence](#licence)

## Setup

First, make sure `eslint` itself is installed among the dev dependencies. "`i`" below means `install`, "`-D`" below means "dev dependency" (as opposed to a normal dependency). Quick refresher — when you publish an npm package and somebody installs it, its dev dependencies don't get installed when they `npm i` your package. That's the point of separating dev and normal dependencies.

Both `eslint` and `eslint-plugin-row-num` are for your program's testing, so we install them as "dev" dependencies, via `-D` flag:

```bash
npm i -D eslint
npm i -D eslint-plugin-row-num
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
"row-num/correct-row-num": "error",
```

means:

"set the rule "correct-row-num" from plugin "row-num" (which comes from npm package "eslint-plugin-row-num") to report findings at an "error" level.

**[⬆ back to top](#)**

## Setup instructions

We need to add `row-num` to the plugins section of your `.eslintrc` configuration file, for example, here's a real config file we use — notice the `"row-num"` in `"plugins"` key:

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
    "plugin:row-num/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": ["row-num"],
  "ignorePatterns": [
    "**/eslint-plugin-row-num/rules/utils/**",
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
    "row-num/correct-row-num": "error",
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
    "row-num/correct-row-num": 2
  }
}
```

or

```json
{
  "rules": {
    "row-num/correct-row-num": "error"
  }
}
```

Both are the same thing.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=eslint-plugin-row-num%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aeslint-plugin-row-num%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=eslint-plugin-row-num%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aeslint-plugin-row-num%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=eslint-plugin-row-num%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aeslint-plugin-row-num%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/eslint-plugin-row-num.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/eslint-plugin-row-num
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/eslint-plugin-row-num
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/eslint-plugin-row-num
[downloads-img]: https://img.shields.io/npm/dm/eslint-plugin-row-num.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/eslint-plugin-row-num
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
