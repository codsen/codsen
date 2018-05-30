# json-sort-cli

> Command line app to deep sort JSON files, also dot-files as long as they are valid JSON

[![Minimum Node version required][node-img]][node-url]
[![Build Status][travis-img]][travis-url]
[![Coverage][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

![example](https://cdn.rawgit.com/codsen/json-sort-cli/2d97ecaa/media/quicktest.gif)

## Table of Contents

<!-- prettier-ignore-start -->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install globally, call anywhere](#install-globally-call-anywhere)
- [API - flags](#api---flags)
- [What it does exactly](#what-it-does-exactly)
- [Updating it](#updating-it)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!-- prettier-ignore-end -->

## Install globally, call anywhere

```bash
npm i -g json-sort-cli
```

* then, either call `jsonsort` or `sortjson` with file name, folder name or a list thereof, with or without flags:

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

**[⬆ &nbsp;back to top](#)**

## API - flags

| short | long            | description                                                       |
| ----- | --------------- | ----------------------------------------------------------------- |
| `-n`  | `--nodemodules` | Don't ignore any **n**ode_modules folders and package-lock.json's |
| `-t`  | `--tabs`        | Use **t**abs for JSON file indentation                            |
| `-s`  | `--silent`      | Don't show line per each processed file, only total recap         |
| `-h`  | `--help`        | Shows (similar to this) **h**elp                                  |
| `-v`  | `--version`     | Shows the installed **v**ersion of your `json-sort-cli`           |

Put either short or long version of a desired flag, before or after the path or list of paths. For example, all these below are the same:

* <code>jsonsort templates/springsale03 <b>-s</b></code>
* <code>jsonsort <b>-s</b> templates/springsale03</code>
* <code>jsonsort templates/springsale03 <b>--silent</b></code>
* <code>jsonsort <b>--silent</b> templates/springsale03</code>

**[⬆ &nbsp;back to top](#)**

## What it does exactly

It **sorts JSON files deeply**. That is, if the object \#1 has an array which has an object \#2, both object \#1 and \#2 keys will be sorted. No matter how deeply nested is a plain object, even within arrays — it will be sorted.

This is a parsing-type application, so written files are also **prettified** — tabulations and whitespace are fixed to an (arbitrary) order. If you leave the default setting, it will indent using two spaces. If you call it with a flag `-t`, one tab will be used.

Under the bonnet, this application uses [ast-monkey-traverse](https://www.npmjs.com/package/ast-monkey-traverse) and [sorted-object](https://www.npmjs.com/package/sorted-object).

**[⬆ &nbsp;back to top](#)**

### Extra features

If you pass a folder name, for example, `jsonsort templates`, it will catch all JSON files in folder `templates`. Sometimes, config [dot files](https://en.wikipedia.org/wiki/Dot-file) can be in JSON format, for example, `.eslintrc` or `.bithoundrc`. When such files are encountered, CLI app will first attempt to JSON-parse them, and, if successful, will sort them. If parsing fails, they'll be listed among failed files.

If a file is a broken JSON file with errors in the markup, it won't cause an error on the whole pipeline — other, healthy files from the batch will still be sorted OK. A broken file will be listed among failed files.

System files like `.DS_Store` are not processed by default, don't worry about excluding them in the input path.

**[⬆ &nbsp;back to top](#)**

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. It's the [same update notifier](https://www.npmjs.com/package/update-notifier) that AVA and [npm](https://www.npmjs.com/package/npm) themselves use!

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/json-sort-cli/issues).

* If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/json-sort-cli/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

JSON regex used from https://github.com/validate-io/json — Copyright © 2015. Athan Reines.

[node-img]: https://img.shields.io/node/v/json-sort-cli.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/json-sort-cli
[travis-img]: https://img.shields.io/travis/codsen/json-sort-cli.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/json-sort-cli
[cov-img]: https://coveralls.io/repos/github/codsen/json-sort-cli/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/json-sort-cli?branch=master
[overall-img]: https://img.shields.io/bithound/code/github/codsen/json-sort-cli.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/json-sort-cli
[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/json-sort-cli.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/json-sort-cli/master/dependencies/npm
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/json-sort-cli
[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/json-sort-cli.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/json-sort-cli/master/dependencies/npm
[vulnerabilities-img]: https://snyk.io/test/github/codsen/json-sort-cli/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/json-sort-cli
[downloads-img]: https://img.shields.io/npm/dm/json-sort-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/json-sort-cli
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/json-sort-cli
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-img]: https://img.shields.io/npm/l/json-sort-cli.svg?style=flat-square
[license-url]: https://github.com/codsen/json-sort-cli/blob/master/license.md
