# json-sort-cli

> Command line app to deep sort JSON files, also dot-files as long as they are valid JSON

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

![example](https://bitbucket.org/codsen/codsen/raw/e99ef54c0bac616e3b12cc4133aafb617f3fc053/packages/json-sort-cli/media/quicktest.gif)

## Table of Contents

- [Install globally, call anywhere](#markdown-header-install-globally-call-anywhere)
- [API - flags](#markdown-header-api-flags)
- [What it does exactly](#markdown-header-what-it-does-exactly)
- [Updating it](#markdown-header-updating-it)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install globally, call anywhere

```bash
npm i -g json-sort-cli
```

- then, either call `jsonsort` or `sortjson` with file name, folder name or a list thereof, with or without flags:

```bash
$ jsonsort file1.csv "folder1/folder2/**/*.*" folder3 -s
$ jsonsort * -t -n -s
$ jsonsort yourspecialfolder -s

$ jsonsort -v
$ jsonsort --version
$ jsonsort -h
$ jsonsort --help
```

or `sortjson`, same thing. I wired up both. See the [API section](#api---flags) (of call for help via CLI, `jsonsort -h`).

**[⬆ back to top](#markdown-header-json-sort-cli)**

## API - flags

| short | long            | description                                                       |
| ----- | --------------- | ----------------------------------------------------------------- |
| `-n`  | `--nodemodules` | Don't ignore any **n**ode_modules folders and package-lock.json's |
| `-t`  | `--tabs`        | Use **t**abs for JSON file indentation                            |
| `-s`  | `--silent`      | Don't show line per each processed file, only total recap         |
| `-h`  | `--help`        | Shows (similar to this) **h**elp                                  |
| `-v`  | `--version`     | Shows the installed **v**ersion of your `json-sort-cli`           |

Put either short or long version of a desired flag, before or after the path or list of paths. For example, all these commands below are the same:

- `jsonsort templates/springsale03 -s`
- `jsonsort -s templates/springsale03`
- `jsonsort templates/springsale03 --silent`
- `jsonsort --silent templates/springsale03`

**[⬆ back to top](#markdown-header-json-sort-cli)**

## What it does exactly

It **sorts JSON files deeply**. That is, it does not matter is it's a plain object within array within array within a plain object - all objects no matter how deep, will be detected and sorted.

This is a parsing-type application, so written files are also **prettified** — tabulations and whitespace are fixed to an (arbitrary) order. If you leave the default setting, it will indent using two spaces. If you call it with a flag `-t`, one tab will be used.

Under the bonnet, this application uses [ast-monkey-traverse](https://www.npmjs.com/package/ast-monkey-traverse) and [sorted-object](https://www.npmjs.com/package/sorted-object).

**[⬆ back to top](#markdown-header-json-sort-cli)**

### Extra features

If you pass a folder name, for example, `jsonsort templates`, it will catch all JSON files in folder `templates`. Sometimes, config [dot files](https://en.wikipedia.org/wiki/Dot-file) can be in JSON format, for example, `.eslintrc` or `.bithoundrc`. When such files are encountered, CLI app will first attempt to JSON-parse them, and, if successful, will sort them. If parsing fails, they'll be listed among failed files.

If a file is a broken JSON file with errors in the markup, it won't cause an error on the whole pipeline — other, healthy files from the batch will still be sorted OK. A broken file will be listed among failed files.

System files like `.DS_Store` are not processed by default, don't worry about excluding them in the input path.

**[⬆ back to top](#markdown-header-json-sort-cli)**

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. It's the [same update notifier](https://www.npmjs.com/package/update-notifier) that AVA and [npm](https://www.npmjs.com/package/npm) themselves use!

**[⬆ back to top](#markdown-header-json-sort-cli)**

## Contributing

- If you see an error, [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=json-sort-cli%20package%20-%20put%20title%20here).
- If you want a new feature but can't code it up yourself, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=json-sort-cli%20package%20-%20put%20title%20here). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](https://bitbucket.org/codsen/codsen/issues/new?title=json-sort-cli%20package%20-%20put%20title%20here). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://bitbucket.org/codsen/codsen/src/) via BitBucket, then write code, then file a pull request via BitBucket. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#markdown-header-json-sort-cli)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

JSON regex used from https://github.com/validate-io/json - Copyright © 2015. Athan Reines.

[node-img]: https://img.shields.io/node/v/json-sort-cli.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/json-sort-cli
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/codsen/src/master/packages/json-sort-cli
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/json-sort-cli
[downloads-img]: https://img.shields.io/npm/dm/json-sort-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/json-sort-cli
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/codsen/src/master/packages/json-sort-cli
