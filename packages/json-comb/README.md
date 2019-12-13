# json-comb

> Command line app to manage sets of JSON files

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Use it](#use-it)
- [API - flags](#api-flags)
- [Normalise](#normalise)
- [Updating it](#updating-it)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i -g json-comb
```

Then, call it from the command line using keyword:

```bash
jsoncomb
```

## Use it

Once installed, call `jsoncomb` in the terminal with list of a file or folder paths, using globs, for example:

```bash
$ jsoncomb --normalise "index.json"
$ jsoncomb -n "data/**/index.json" -i "data/defaults.json"
$ jsoncomb -n "**/*.json" -t

$ jsoncomb -v
$ jsoncomb --version
$ jsoncomb -h
$ jsoncomb --help
```

**[⬆ back to top](#)**

## API - flags

| short | long          | description                                                   |
| ----- | ------------- | ------------------------------------------------------------- |
| `-n`  | `--normalise` | Normalise all files in the given set                          |
| `-i`  | `--ignore`    | **I**gnore paths if they contain only placeholder values      |
| `-t`  | `--tabs`      | Use **t**abs instead of default 2 spaces for JSON indentation |
| `-v`  | `--version`   | Shows the installed **v**ersion of your `json-sort-cli`       |
| `-h`  | `--help`      | Shows (similar to this) **h**elp                              |

**[⬆ back to top](#)**

## Normalise

```bash
$ jsoncomb --normalise "index.json"
$ jsoncomb -n "data/**/index.json" -i "data/defaults.json"
```

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. It's the [same update notifier](https://www.npmjs.com/package/update-notifier) that AVA and [npm](https://www.npmjs.com/package/npm) themselves use!

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=json-comb%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ajson-comb%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=json-comb%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ajson-comb%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=json-comb%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ajson-comb%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/json-comb.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/json-comb
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/json-comb
[cov-img]: https://img.shields.io/badge/coverage-86.27%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/json-comb
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/json-comb
[downloads-img]: https://img.shields.io/npm/dm/json-comb.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/json-comb
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
