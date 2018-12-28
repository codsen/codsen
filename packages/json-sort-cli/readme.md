# json-sort-cli

> Command line app to deep sort JSON files, also dot-files as long as they are valid JSON

[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

![example](https://bitbucket.org/codsen/json-sort-cli/raw/ca7bf87734f84f48a8793ed7df0af7d680ef84e4/media/quicktest.gif)

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

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/json-sort-cli/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/json-sort-cli/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-json-sort-cli)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

JSON regex used from https://github.com/validate-io/json - Copyright © 2015. Athan Reines.

[node-img]: https://img.shields.io/node/v/json-sort-cli.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/json-sort-cli
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/json-sort-cli
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/json-sort-cli
[downloads-img]: https://img.shields.io/npm/dm/json-sort-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/json-sort-cli
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/json-sort-cli
