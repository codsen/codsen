# json-sort-cli

> Command line app to deep sort JSON files, retains package.json special key order

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

<div align="center">
  <img alt="example" src="https://glcdn.githack.com/codsen/codsen/raw/master/packages/json-sort-cli/media/quicktest.gif" width="760" align="center">
</div>

## Table of Contents

- [Install](#install)
- [Use it](#use-it)
- [API - flags](#api-flags)
- [What it does exactly](#what-it-does-exactly)
- [CI mode](#ci-mode)
- [Updating it](#updating-it)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i -g json-sort-cli
```

Then, call it from the command line using one of the following keywords:

```bash
jsonsort
sortjson
```

## Use it

Once installed, either call `jsonsort` or `sortjson` with file name, folder name or a list thereof, with or without flags:

```bash
$ jsonsort file1.json "folder1/folder2/**/*.*" folder3 -s
$ jsonsort * -t -n -s
$ jsonsort yourspecialfolder -s

$ jsonsort -v
$ jsonsort --version
$ jsonsort -h
$ jsonsort --help
```

or `sortjson`, same thing. I wired up both. See the [API section](#api---flags) (of call for help via CLI, `jsonsort -h`).

**[⬆ back to top](#)**

## API - flags

| short | long                 | description                                                                                        |
| ----- | -------------------- | -------------------------------------------------------------------------------------------------- |
| `-n`  | `--nodemodules`      | Don't ignore any **n**ode_modules folders and package-lock.json's                                  |
| `-t`  | `--tabs`             | Use **t**abs for JSON file indentation                                                             |
| `-i`  | `--indentationCount` | How many spaces or tabs to use (default = 2 spaces or 1 tab)                                       |
| `-s`  | `--silent`           | When on, no output is shown. Only exit codes determine the success or failure.                     |
| `-a`  | `--arrays`           | Also sort any arrays if they contain only string elements                                          |
| `-h`  | `--help`             | Shows (similar to this) **h**elp                                                                   |
| `-v`  | `--version`          | Shows the installed **v**ersion of your `json-sort-cli`                                            |
| `-p`  | `--pack`             | Skip all `package.json` files                                                                      |
| `-d`  | `--dry`              | Only output the paths of the files                                                                 |
| `-c`  | `--ci`               | Does nothing, exits with non-zero code if files COULD BE sorted, with zero code if no sort needed. |

Put either short or long version of a desired flag, before or after the path or list of paths. For example, all these commands below are the same:

- `jsonsort templates/springsale03 -s`
- `jsonsort -s templates/springsale03`
- `jsonsort templates/springsale03 --silent`
- `jsonsort --silent templates/springsale03`

**[⬆ back to top](#)**

## What it does exactly

It **sorts JSON files deeply**.

That is, it does not matter is it's a plain object within array within array within a plain object - all objects no matter how deep, will be detected and sorted.

If this tool processes any `package.json` files (put `-p` to disable this), it will first deep-sort alphabetically, then use `format-package` ([npm](https://www.npmjs.com/package/format-package)) to arrange keys according to a commonly agreed format — `name` at the top, depedencies at the bottom etc.

This is a parsing-type application, so written files are also **prettified** — tabulations and whitespace are fixed to an (arbitrary) order. If you leave the default setting, it will indent using two spaces. If you call it with a flag `-t`, one tab will be used.

Under the bonnet, this application uses [ast-monkey-traverse](https://www.npmjs.com/package/ast-monkey-traverse), [sorted-object](https://www.npmjs.com/package/sorted-object), [format-package](https://www.npmjs.com/package/format-package).

**[⬆ back to top](#)**

### Extra features

- `package.json` are first deep-sorted alphabetically, then using `format-package` ([npm](https://www.npmjs.com/package/format-package)) (on by default, but put `-p` to disable this)
- Works on dot files, as long as they are parse-able as JSON
- Can process a set of files in folder (use wildcards for example, `jsonsort "**/packages/*/data/*.json"`)
- Broken JSON files don't stop the process, other healthy files from batch are still sorted. Notifies user.
- System files like `.DS_Store` are not processed by default, don't worry about excluding them in the input path.

**[⬆ back to top](#)**

## CI mode

When in CI mode, this CLI won't amend the files, only calculate the sorted result, compare the file's contents with it, then exit with a:

- zero code, if sorting would make no difference to a file
- non-zero code, if sorting would not make any difference

Basically, your scripts with this CLI would fail on unsorted JSON's. Thanks [widerin](https://gitlab.com/widerin) for the idea for this feature.

**CI mode does not write files**, only exits with one code or another.

**[⬆ back to top](#)**

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. It's the [same update notifier](https://www.npmjs.com/package/update-notifier) that AVA and [npm](https://www.npmjs.com/package/npm) themselves use!

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=json-sort-cli%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ajson-sort-cli%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=json-sort-cli%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ajson-sort-cli%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=json-sort-cli%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ajson-sort-cli%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/json-sort-cli.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/json-sort-cli
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/json-sort-cli
[cov-img]: https://img.shields.io/badge/coverage-84.07%25-yellow.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/json-sort-cli
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/json-sort-cli
[downloads-img]: https://img.shields.io/npm/dm/json-sort-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/json-sort-cli
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
